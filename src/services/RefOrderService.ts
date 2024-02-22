import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { isNotHybrid } from '@/composables';
import { useDateFormat } from '@vueuse/core'

export interface RefOrder {
    category: string;

    /**
     * Ref
     */
    orderId: string;
    /**
     * 总金额
     */
    totalAmount: number;
    /**
     * 外显的订单状态
     */
    showOrderStatusDesc: string;
    /**
     * 创建时间
     */
    createTime: Date;
    /**
     * 出行时间
     */
    travelTime?: Date;  // TODO: 这个字段后续支持

    title: string;
    firstDesc?: string;
    secondDesc?: string;
}

const getQueryListCache = (key: string) => {
    const cached = localStorage.getItem(`RefOrderService.QueryList.${key}`)
    if (cached) {
        return JSON.parse(cached).map((item: any) => {
            item.createTime = new Date(item.createTime)
            return item
        }) as RefOrder[]
    }
    return undefined
}

const setQueryListCache = (key: string, value: RefOrder[]) => {
    if (value.length == 0) return
    localStorage.setItem(`RefOrderService.QueryList.${key}`, JSON.stringify(value))
}

export abstract class AbstractRefOrderService {
    public abstract queryList: (clearCache: boolean) => Promise<RefOrder[]>;
}

export class DaMaiRefOrderService extends AbstractRefOrderService {
    _user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0';

    private _innerQueryDetail = async (orderId: string, cookies?: string) => {
        if (!cookies) {
            const { value: preferenceValue } = await Preferences.get({ key: 'Mine.AccountBind.DaMai' })
            const { cookies: preferenceCookies } = JSON.parse(preferenceValue || '{}')
            cookies = preferenceCookies
        }

        const response = await CapacitorHttp.get({
            url: 'https://orders.damai.cn/multi/trans/orderDetail',
            headers: {
                'User-Agent': this._user_agent,
                'Referer': "https://orders.damai.cn/orderDetail?orderId=" + orderId,
                'Cookie': cookies || ''
            },
            params: {
                orderId
            },
        })

        const { success, resultCode, resultMessage, module } = response.data as {
            success: boolean, resultCode: string, resultMessage: string,
            module: {
                createTimeStr: string,
                orderListInfo: {
                    orderDetailItemInfoList: {
                        seatInfo: string
                    }[]
                }
            }
        }

        const { createTimeStr, orderListInfo } = module
        // TODO: 这里先暂时只支持一个座位
        const seatInfo = orderListInfo.orderDetailItemInfoList[0].seatInfo

        return { createTime: new Date(createTimeStr), seatInfo }
    }

    private _innerQueryList = async (pageNum = 1) => {
        const { value: preferenceValue } = await Preferences.get({ key: 'Mine.AccountBind.DaMai' })
        const { cookies } = JSON.parse(preferenceValue || '{}')

        const response = await CapacitorHttp.get({
            url: 'https://orders.damai.cn/multi/trans/orderList',
            headers: {
                'User-Agent': this._user_agent,
                'Referer': 'https://orders.damai.cn/orderList',
                'Cookie': cookies
            },
            params: {
                pageNum: pageNum.toString(),
                pageSize: '20'
            },
        })

        console.log(JSON.stringify(response.data))

        const { success, resultCode, resultMessage, module } = response.data as {
            success: boolean, resultCode: string, resultMessage: string,
            module: {
                totalCount: number,
                summaryOrderItemVOList: {
                    orderId: string,
                    totalAmount: string,
                    showStatusDesc: string,

                    projectId: string,
                    projectName: string,
                    showTime: string,
                    performName: string,
                    venueName: string,
                    projectPicUrl: string,
                }[]
            }
        }

        const { totalCount, summaryOrderItemVOList } = module

        const results = [] as RefOrder[]
        for (const item of summaryOrderItemVOList) {
            const { createTime, seatInfo } = await this._innerQueryDetail(item.orderId, cookies)

            results.push({
                category: '大麦',

                orderId: item.orderId,
                totalAmount: Number.parseFloat(item.totalAmount.replace('￥', '')),
                showOrderStatusDesc: item.showStatusDesc,
                createTime,

                title: item.projectName,
                firstDesc: item.showTime.replace('演出场次：', ''),
                secondDesc: item.venueName.replace('演出场馆：', '')
            })
        }

        if (results.length < totalCount) {
            results.push(...await this._innerQueryList(pageNum + 1))
        }

        return results
    }

    public queryList = async (clearCache = false) => {
        try {
            if (isNotHybrid) return []

            const cached = getQueryListCache('DaMai')
            if (cached && cached.length > 0 && !clearCache) return cached

            const results = await this._innerQueryList()
            setQueryListCache('DaMai', results)
            return results
        } catch (error) {
            console.error(error)
            return []
        }
    }
}

export class TcTravelRefOrderService extends AbstractRefOrderService {
    _user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0';

    /**
     * @param dateType 0: 三个月内的订单 1: 三个月前的订单 
     */
    private _innerQueryList = async (dateType: '0' | '1', pageNum = 1) => {
        const { value: preferenceValue } = await Preferences.get({ key: 'Mine.AccountBind.TcTravel' })
        const { cookies } = JSON.parse(preferenceValue || '{}')

        const response = await CapacitorHttp.post({
            url: 'https://m.ly.com/member/order/getlist',
            headers: {
                'User-Agent': this._user_agent,
                'Referer': 'https://m.ly.com/member/order',
                'Cookie': cookies
            },
            params: {
                dateType,
                "_": new Date().getTime().toString(),
                PageIndex: pageNum.toString(),
                PageSize: '20',
                projectTag: ''
            },
            dataType: 'formData',
            responseType: 'json'
        })

        console.log(JSON.stringify(response.data))

        const { pageInfo, orderListAll } = response.data?.response?.body as {
            pageInfo: {
                totalPage: number
            },
            orderListAll: {
                orderId: string,
                orderSerialId: string,
                amount: string,
                orderStatus: string,
                orderCreateTime: string,

                projectTag: string,
                title: string,
                firstDesc: string,
                scendDesc: string,
                ExtendData: any
            }[]
        }

        const { totalPage } = pageInfo

        const results = [] as RefOrder[]
        for (const item of orderListAll) {

            results.push({
                category: '同程旅行',

                orderId: item.orderId,
                totalAmount: Number.parseFloat(item.amount.replace('¥', '')),
                showOrderStatusDesc: item.orderStatus,
                createTime: new Date(item.orderCreateTime),

                title: item.title,
                firstDesc: item.firstDesc,
                secondDesc: item.scendDesc
            })
        }

        if (pageNum < totalPage) {
            results.push(...await this._innerQueryList(dateType, pageNum + 1))
        }

        return results
    }

    public queryList = async (clearCache = false) => {
        try {
            if (isNotHybrid) return []

            const cached = getQueryListCache('TcTravel')
            if (cached && cached.length > 0 && !clearCache) return cached

            const inThreeMonthsResults = await this._innerQueryList('0')
            const beforeThreeMonthsResults = await this._innerQueryList('1')
            const results = [...inThreeMonthsResults, ...beforeThreeMonthsResults]
            setQueryListCache('TcTravel', results)
            return results
        } catch (error) {
            console.error(error)
            return []
        }
    }
}

export class CtripTravelRefOrderService extends AbstractRefOrderService {
    _user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0';

    private _innerQueryList = async (pageNum = 1) => {
        const { value: preferenceValue } = await Preferences.get({ key: 'Mine.AccountBind.TcTravel' })
        const { cookies } = JSON.parse(preferenceValue || '{}')

        const response = await CapacitorHttp.post({
            url: 'https://m.ctrip.com/restapi/soa2/10098/getAllOrders.json?_fxpcqlniredt=09031072314671530498',
            headers: {
                'User-Agent': this._user_agent,
                'Referer': 'https://m.ctrip.com/webapp/myctrip/orders/allorders.html?filterValidOrder=false&status=All&timeIndex=-1&selectPageName=AllOrderListPage',
                'Cookie': cookies,
                'Content-Type': 'application/json'
            },
            responseType: 'json',
            data: {
                Count: 15,
                OrderStatusClassify: 'ALL',
                NeedOrderAmountDetail: true,
                ClientVersion: "99.99",
                Channel: 'H5',
            }
        })

        console.log(JSON.stringify(response.data))

        const { Result, OrderEnities } = response.data as {
            Result: {
                ResultCode: number
            },
            OrderEnities: {
                OrderID: string,
                OrderTotalPrice: number,
                OrderStatusName: string,
                BookingDate: string,

                OrderName: string,
            }[]
        }

        const results = [] as RefOrder[]
        for (const item of OrderEnities) {

            results.push({
                category: '携程旅行',

                orderId: item.OrderID,
                totalAmount: item.OrderTotalPrice,
                showOrderStatusDesc: item.OrderStatusName,
                createTime: new Date(Number.parseInt(item.BookingDate.replace('/Date(', '').replace('+0800)/', ''))),

                title: item.OrderName
            })
        }

        return results
    }

    public queryList = async (clearCache = false) => {
        try {
            if (isNotHybrid) return []

            const cached = getQueryListCache('CtripTravel')
            if (cached && cached.length > 0 && !clearCache) return cached

            // TODO: 回头这里有空应该切换到 PC 端的下载方式
            const results = await this._innerQueryList()
            setQueryListCache('CtripTravel', results)
            return results
        } catch (error) {
            console.error(error)
            return []
        }
    }
}

export class GovTrain12306RefOrderService extends AbstractRefOrderService {
    _user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0';

    /**
     * @param queryWhere G: 未出行订单 H: 历史订单
     */
    private _innerQueryList = async (queryWhere: 'G' | 'H', pageNum = 1) => {
        const now = new Date()
        const start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)

        const { value: preferenceValue } = await Preferences.get({ key: 'Mine.AccountBind.GovTrain12306' })
        const { cookies } = JSON.parse(preferenceValue || '{}')

        const nowCookies = `_jc_save_wfdc_flag=dc; _jc_save_toDate=${useDateFormat(now, 'YYYY-MM-DD').value}; `

        const response = await CapacitorHttp.post({
            url: 'https://kyfw.12306.cn/otn/queryOrder/queryMyOrder',
            headers: {
                'User-Agent': this._user_agent,
                'Referer': 'https://kyfw.12306.cn/otn/view/train_order.html',
                'Cookie': nowCookies + cookies,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                come_from_flag: 'my_order',
                pageIndex: pageNum - 1,
                pageSize: 8,
                query_where: queryWhere,
                queryStartDate: useDateFormat(start, 'YYYY-MM-DD').value,
                queryEndDate: useDateFormat(now, 'YYYY-MM-DD').value,
                queryType: 1,
                sequeue_train_name: '',
            }
        })

        console.log(response.status + '\n' + JSON.stringify(response.data))

        const { status, data } = response.data as {
            status: boolean,
            data: {
                OrderDTODataList: {
                    order_date: string,

                    tickets: {
                        ticket_no: string,
                        sequence_no: string,
                        // 17
                        coach_name: string,
                        // 054号
                        seat_name: string,
                        // 硬座
                        seat_type_name: string,
                        // 成人票
                        ticket_type_name: string,
                        str_ticket_price_page: number,
                        ticket_status_name: string,
                        stationTrainDTO: {
                            distance: string,
                            station_train_code: string,
                            arrive_date_local: string,
                            arrive_time_local: string,
                            from_station_telecode: string,
                            to_station_telecode: string,
                            from_station_name: string,
                            to_station_name: string,
                        },
                        passengerDTO: {
                            passenger_name: string,
                        },
                        start_train_date_page: string,
                    }[]
                }[]
            }
        }

        const { OrderDTODataList } = data || { OrderDTODataList: [] }

        const results = [] as RefOrder[]
        for (const item of OrderDTODataList) {
            for (const ticket of item.tickets) {
                // 已退票(业务流水号:2EG63885923001001191907090    )
                let showOrderStatusDesc = ticket.ticket_status_name
                if (showOrderStatusDesc.includes('(业务流水号:')) {
                    showOrderStatusDesc = showOrderStatusDesc.split('(业务流水号:')[0]
                }

                // arrive_time_local -> 1970-01-01 15:51:00
                // arrive_date_local -> 2023-12-29 00:00:00
                const startTime = new Date(ticket.start_train_date_page)
                const arriveTime = new Date(ticket.stationTrainDTO.arrive_date_local.split(' ')[0] + ' ' + ticket.stationTrainDTO.arrive_time_local.split(' ')[1])

                results.push({
                    category: '12306',

                    orderId: ticket.ticket_no,
                    totalAmount: ticket.str_ticket_price_page,
                    showOrderStatusDesc,
                    createTime: new Date(item.order_date),

                    title: `${ticket.stationTrainDTO.station_train_code} ${ticket.stationTrainDTO.from_station_name} - ${ticket.stationTrainDTO.to_station_name}`,
                    firstDesc: `${useDateFormat(startTime, 'MM-DD HH:mm').value} 至 ${useDateFormat(arriveTime, 'MM-DD HH:mm').value} 共 ${ticket.stationTrainDTO.distance} KM`,
                    secondDesc: `${ticket.passengerDTO.passenger_name} ${ticket.seat_type_name} ${ticket.coach_name}车 ${ticket.seat_name}`
                })
            }
        }

        return results
    }

    public queryList = async (clearCache = false) => {
        try {
            if (isNotHybrid) return []

            const cached = getQueryListCache('GovTrain12306')
            if (cached && cached.length > 0 && !clearCache) return cached

            const g_results = await this._innerQueryList('G')
            const h_results = await this._innerQueryList('H')
            const results = [...g_results, ...h_results]
            setQueryListCache('GovTrain12306', results)
            return results
        } catch (error) {
            console.error(error)
            return []
        }
    }
}
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import {
    Home,
    Users,
    DollarSign,
    Calendar,
    TrendingUp,
    UserCheck,
    Building,
    CreditCard,
    Activity,
    PieChart as PieIcon,
    Filter,
    RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

// ================== TYPES ==================

interface SummaryStats {
    totalUsers: number;
    totalAgents: number;
    totalProperties: number;
    totalRevenue: number;
}

interface MonthlyRevenueItem {
    month: string;     // ví dụ "2025-01" hoặc "Jan"
    revenue: number;   // doanh thu
}

interface CityStat {
    city: string | null;
    total: number;
}

interface PropertyStatsResponse {
    totalProperties: number;
    sale: number;
    rent: number;
    published: number;
    pending: number;
    propertyTypeStats: Record<string, number>; // { "APARTMENT": 10, "HOUSE": 5, ... }
    cityStats: CityStat[];
}

interface AgentStatsResponse {
    totalAgents: number;
    planStats: Record<string, number>; // { "FREE": 10, "MONTHLY": 5, ... }
    totalRevenue: number;
    cityStats: CityStat[];
}

type FilterType = 'day' | 'month' | 'year';

interface PieData {
    name: string;
    value: number;
    color: string;
}

interface BarCityData {
    city: string;
    total: number;
}

// ================== DASHBOARD COMPONENT ==================

const Dashboard: React.FC = () => {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState<string>('overview');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const [summary, setSummary] = useState<SummaryStats | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueItem[]>([]);
    const [propertyStats, setPropertyStats] = useState<PropertyStatsResponse | null>(null);
    const [agentStats, setAgentStats] = useState<AgentStatsResponse | null>(null);

    // Bộ lọc thời gian dùng chung cho propertyStats & agentStats
    const [filterType, setFilterType] = useState<FilterType>('month');
    const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
    const [filterDay, setFilterDay] = useState<number | ''>('');

    // ================== HELPERS ==================

    const authHeaders = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const buildDateParams = () => {
        const params: Record<string, number> = {};
        if (filterType === 'day') {
            if (filterDay) {
                params.day = Number(filterDay);
                params.month = filterMonth;
                params.year = filterYear;
            }
        } else if (filterType === 'month') {
            params.month = filterMonth;
            params.year = filterYear;
        } else if (filterType === 'year') {
            params.year = filterYear;
        }
        return params;
    };

    const formatCurrency = (value: number | undefined | null) => {
        if (value == null) return '0';
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        });
    };

    const formatNumber = (value: number | undefined | null) => {
        if (value == null) return '0';
        return value.toLocaleString('vi-VN');
    };

    const filterLabel = () => {
        if (filterType === 'day') {
            return `Ngày ${filterDay || '--'}/${filterMonth}/${filterYear}`;
        }
        if (filterType === 'month') {
            return `Tháng ${filterMonth}/${filterYear}`;
        }
        return `Năm ${filterYear}`;
    };

    const getPlanBadgeVariant = (plan: string) => {
        switch (plan) {
            case 'FREE':
                return 'outline';
            case 'MONTHLY':
                return 'secondary';
            case 'YEARLY':
                return 'default';
            case 'THREE_YEAR':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // ================== API CALLS ==================

    const fetchSummary = async () => {
        try {
            const res = await axios.get<SummaryStats>(
                'http://localhost:8080/api/dashboard/summary',
                { headers: authHeaders }
            );
            setSummary(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải dữ liệu tổng quan');
        }
    };

    const fetchMonthlyRevenue = async () => {
        try {
            const res = await axios.get<any[]>(
                'http://localhost:8080/api/dashboard/monthly-revenue',
                { headers: authHeaders }
            );
            // Chuẩn hoá data: tuỳ backend trả "month", "revenue" hay "total"
            const normalized: MonthlyRevenueItem[] = (res.data || []).map((item: any) => {
                const month =
                    item.monthLabel ||
                    item.month ||
                    `${item.year ?? ''}-${item.month ?? ''}`;
                const revenue =
                    item.revenue ??
                    item.totalRevenue ??
                    item.total ??
                    item.amount ??
                    0;
                return {
                    month: String(month),
                    revenue: Number(revenue),
                };
            });
            setMonthlyRevenue(normalized);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải dữ liệu doanh thu theo tháng');
        }
    };

    const fetchPropertyStats = async () => {
        try {
            const params = buildDateParams();
            const res = await axios.get<PropertyStatsResponse>(
                'http://localhost:8080/api/dashboard/properties/stats',
                { headers: authHeaders, params }
            );
            setPropertyStats(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải thống kê bất động sản');
        }
    };

    const fetchAgentStats = async () => {
        try {
            const params = buildDateParams();
            const res = await axios.get<AgentStatsResponse>(
                'http://localhost:8080/api/dashboard/agents/stats',
                { headers: authHeaders, params }
            );
            setAgentStats(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải thống kê agent');
        }
    };

    const refreshAll = async () => {
        if (!token) return;
        try {
            setIsRefreshing(true);
            await Promise.all([
                fetchSummary(),
                fetchMonthlyRevenue(),
                fetchPropertyStats(),
                fetchAgentStats(),
            ]);
            toast.success('Đã cập nhật dashboard');
        } finally {
            setIsRefreshing(false);
        }
    };

    // ================== EFFECTS ==================

    useEffect(() => {
        if (!token) return;
        const init = async () => {
            setIsLoading(true);
            await refreshAll();
            setIsLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Khi đổi filter → load lại propertyStats & agentStats
    useEffect(() => {
        if (!token) return;
        const refetch = async () => {
            await Promise.all([fetchPropertyStats(), fetchAgentStats()]);
        };
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType, filterYear, filterMonth, filterDay]);

    // ================== DERIVED DATA ==================

    // Pie chart: property types
    const propertyTypePieData: PieData[] =
        propertyStats && propertyStats.propertyTypeStats
            ? Object.entries(propertyStats.propertyTypeStats).map(
                ([name, value], index) => {
                    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
                    return {
                        name,
                        value,
                        color: colors[index % colors.length],
                    };
                }
            )
            : [];

    // Pie chart: plan distribution (agent)
    const planPieData: PieData[] =
        agentStats && agentStats.planStats
            ? Object.entries(agentStats.planStats).map(([name, value], index) => {
                const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
                return {
                    name,
                    value,
                    color: colors[index % colors.length],
                };
            })
            : [];

    // Bar chart: property by city
    const propertyCityData: BarCityData[] =
        propertyStats?.cityStats?.map((c) => ({
            city: c.city || 'Khác',
            total: c.total,
        })) ?? [];

    // Bar chart: agent by city
    const agentCityData: BarCityData[] =
        agentStats?.cityStats?.map((c) => ({
            city: c.city || 'Khác',
            total: c.total,
        })) ?? [];

    // ================== LOADING UI ==================

    if (isLoading || !summary) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                        Đang tải dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // ================== RENDER ==================

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Dashboard quản trị
                    </h1>
                    <p className="text-muted-foreground">
                        Tổng quan hệ thống bất động sản: người dùng, agent, tin đăng, doanh thu.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-green-500" />
                        Real-time
                    </Badge>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={refreshAll}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                    </Button>
                </div>
            </div>

            {/* FILTER + SUMMARY */}
            <div className="space-y-4">
                {/* FILTER BAR */}
                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                <Filter className="w-4 h-4" />
                                Bộ lọc thời gian thống kê
                            </CardTitle>
                            <CardDescription>
                                Áp dụng cho thống kê bất động sản và agent.
                            </CardDescription>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{filterLabel()}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-3 md:items-end justify-between">
                        <div className="flex flex-wrap gap-3">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Kiểu thống kê
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant={filterType === 'day' ? 'default' : 'outline'}
                                        onClick={() => setFilterType('day')}
                                    >
                                        Ngày
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={filterType === 'month' ? 'default' : 'outline'}
                                        onClick={() => setFilterType('month')}
                                    >
                                        Tháng
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={filterType === 'year' ? 'default' : 'outline'}
                                        onClick={() => setFilterType('year')}
                                    >
                                        Năm
                                    </Button>
                                </div>
                            </div>

                            {filterType !== 'year' && (
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Tháng
                                    </span>
                                    <select
                                        className="border rounded-md px-2 py-1 text-sm bg-background"
                                        value={filterMonth}
                                        onChange={(e) => setFilterMonth(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                Tháng {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {filterType === 'day' && (
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Ngày
                                    </span>
                                    <input
                                        type="number"
                                        className="border rounded-md px-2 py-1 text-sm w-20 bg-background"
                                        value={filterDay}
                                        min={1}
                                        max={31}
                                        onChange={(e) =>
                                            setFilterDay(
                                                e.target.value ? Number(e.target.value) : ''
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Năm
                                </span>
                                <input
                                    type="number"
                                    className="border rounded-md px-2 py-1 text-sm w-24 bg-background"
                                    value={filterYear}
                                    onChange={(e) =>
                                        setFilterYear(
                                            Number(e.target.value) || new Date().getFullYear()
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground md:hidden">
                            <Calendar className="w-4 h-4" />
                            <span>{filterLabel()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* SUMMARY CARDS */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Tổng user */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Tổng người dùng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(summary.totalUsers)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Bao gồm USER &amp; AGENT
                            </p>
                            <Progress
                                className="mt-2"
                                value={
                                    summary.totalUsers > 0
                                        ? (summary.totalAgents / summary.totalUsers) * 100
                                        : 0
                                }
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Agent chiếm{' '}
                                {summary.totalUsers > 0
                                    ? (
                                        (summary.totalAgents / summary.totalUsers) *
                                        100
                                    ).toFixed(1)
                                    : '0'}
                                %
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tổng BĐS */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-500" />
                                Bất động sản
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(summary.totalProperties)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Số tin đăng đang quản lý
                            </p>
                            {propertyStats && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Trong khoảng {filterLabel()} có{' '}
                                    <span className="font-semibold">
                                        {formatNumber(propertyStats.totalProperties)}
                                    </span>{' '}
                                    tin mới.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tổng Agent */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-emerald-500" />
                                Agent
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(summary.totalAgents)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Sử dụng các gói FREE / MONTHLY / YEARLY / THREE_YEAR
                            </p>
                            {agentStats && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {Object.entries(agentStats.planStats).map(
                                        ([plan, value]) => (
                                            <Badge
                                                key={plan}
                                                variant={getPlanBadgeVariant(plan)}
                                                className="text-[10px]"
                                            >
                                                {plan}: {value}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tổng doanh thu */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-yellow-500" />
                                Tổng doanh thu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {formatCurrency(summary.totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tổng từ các gói &amp; giao dịch trong toàn hệ thống.
                            </p>
                            {agentStats && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Doanh thu từ gói agent trong {filterLabel()}:{' '}
                                    <span className="font-semibold">
                                        {formatCurrency(agentStats.totalRevenue)}
                                    </span>
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* TABS */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Tổng quan</span>
                    </TabsTrigger>
                    <TabsTrigger value="properties" className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span className="hidden sm:inline">Bất động sản</span>
                    </TabsTrigger>
                    <TabsTrigger value="agents" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Agent</span>
                    </TabsTrigger>
                    <TabsTrigger value="finance" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Tài chính</span>
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Doanh thu theo tháng (Bar + Line dùng chung data thật) */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        Doanh thu theo tháng
                                    </CardTitle>

                                </div>
                            </CardHeader>
                            <CardContent className="h-72">
                                {monthlyRevenue.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu doanh thu theo tháng.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReBarChart data={monthlyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: any) =>
                                                    formatCurrency(Number(val))
                                                }
                                            />
                                            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} />
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Đường xu hướng từ cùng dữ liệu doanh thu */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Line className="w-4 h-4 text-sky-500" />
                                    Xu hướng doanh thu
                                </CardTitle>
                                <CardDescription>
                                    Sử dụng cùng dữ liệu thật từ monthly-revenue.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-72">
                                {monthlyRevenue.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu đủ để vẽ xu hướng.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: any) =>
                                                    formatCurrency(Number(val))
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#4f46e5"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* PROPERTIES TAB */}
                <TabsContent value="properties" className="space-y-4">
                    {/* Top cards */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Home className="w-4 h-4 text-primary" />
                                    Tổng tin trong khoảng
                                </CardTitle>
                                <CardDescription>{filterLabel()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatNumber(propertyStats?.totalProperties ?? 0)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tổng số tin được tạo trong khoảng thời gian.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">SALE</CardTitle>
                                <CardDescription>Tin bán</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatNumber(propertyStats?.sale ?? 0)}
                                </div>
                                <Progress
                                    className="mt-2"
                                    value={
                                        propertyStats?.totalProperties
                                            ? (propertyStats.sale /
                                                propertyStats.totalProperties) *
                                            100
                                            : 0
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">RENT</CardTitle>
                                <CardDescription>Tin cho thuê</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatNumber(propertyStats?.rent ?? 0)}
                                </div>
                                <Progress
                                    className="mt-2"
                                    value={
                                        propertyStats?.totalProperties
                                            ? (propertyStats.rent /
                                                propertyStats.totalProperties) *
                                            100
                                            : 0
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Trạng thái</CardTitle>
                                <CardDescription>PUBLISHED vs PENDING</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <div className="font-semibold text-emerald-600">
                                            {formatNumber(propertyStats?.published ?? 0)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            PUBLISHED
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-amber-600">
                                            {formatNumber(propertyStats?.pending ?? 0)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            PENDING
                                        </div>
                                    </div>
                                </div>
                                <Progress
                                    value={
                                        propertyStats?.totalProperties
                                            ? (propertyStats.published /
                                                propertyStats.totalProperties) *
                                            100
                                            : 0
                                    }
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Pie property types */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieIcon className="w-4 h-4 text-indigo-500" />
                                        Phân bố loại bất động sản
                                    </CardTitle>
                                    <CardDescription>
                                        Dựa trên propertyTypeStats từ API /dashboard/properties/stats.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="h-80">
                                {propertyTypePieData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu thống kê loại bất động sản.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={propertyTypePieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {propertyTypePieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-property-type-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bar property by city */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-blue-500" />
                                    Tin đăng theo thành phố
                                </CardTitle>
                                <CardDescription>{filterLabel()}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                {propertyCityData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu theo thành phố.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReBarChart data={propertyCityData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="city" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* AGENTS TAB */}
                <TabsContent value="agents" className="space-y-4">
                    {/* Top cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    Tổng agent trong khoảng
                                </CardTitle>
                                <CardDescription>{filterLabel()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatNumber(agentStats?.totalAgents ?? 0)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Agent có planStartDate nằm trong khoảng thời gian.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-yellow-500" />
                                    Doanh thu gói agent
                                </CardTitle>
                                <CardDescription>{filterLabel()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold">
                                    {formatCurrency(agentStats?.totalRevenue ?? 0)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tổng planPrice của agent trong khoảng thời gian.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <PieIcon className="w-4 h-4 text-emerald-500" />
                                    Số lượng từng gói
                                </CardTitle>
                                <CardDescription>FREE / MONTHLY / YEARLY / THREE_YEAR</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1">
                                    {planPieData.map((p) => (
                                        <Badge
                                            key={p.name}
                                            variant={getPlanBadgeVariant(p.name)}
                                            className="text-[10px]"
                                        >
                                            {p.name}: {p.value}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Pie plans */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieIcon className="w-4 h-4 text-primary" />
                                        Phân bố gói agent
                                    </CardTitle>
                                    <CardDescription>
                                        Dựa trên planStats từ API /dashboard/agents/stats.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="h-80">
                                {planPieData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu thống kê gói agent.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={planPieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {planPieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-plan-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bar agent by city */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-blue-500" />
                                    Agent theo thành phố
                                </CardTitle>
                                <CardDescription>{filterLabel()}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                {agentCityData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu agent theo thành phố.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReBarChart data={agentCityData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="city" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* FINANCE TAB */}
                <TabsContent value="finance" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Reuse doanh thu theo tháng */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        Doanh thu (chi tiết theo tháng)
                                    </CardTitle>
                                    <CardDescription>
                                        Sử dụng dữ liệu từ /api/dashboard/monthly-revenue.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="h-80">
                                {monthlyRevenue.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Chưa có dữ liệu doanh thu.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReBarChart data={monthlyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: any) =>
                                                    formatCurrency(Number(val))
                                                }
                                            />
                                            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} />
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tổng kết nhanh */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-emerald-500" />
                                    Tóm tắt tài chính
                                </CardTitle>
                                <CardDescription>
                                    Dựa trên các API dashboard hiện có.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                    • Tổng doanh thu toàn hệ thống:{' '}
                                    <span className="font-semibold">
                                        {formatCurrency(summary.totalRevenue)}
                                    </span>
                                </p>
                                <p>
                                    • Doanh thu từ gói agent trong {filterLabel()}:{' '}
                                    <span className="font-semibold">
                                        {formatCurrency(agentStats?.totalRevenue ?? 0)}
                                    </span>
                                </p>
                                <p>
                                    • Số agent đang hoạt động trong khoảng:{' '}
                                    <span className="font-semibold">
                                        {formatNumber(agentStats?.totalAgents ?? 0)}
                                    </span>
                                </p>
                                <p>
                                    • Số tin đăng mới trong khoảng:{' '}
                                    <span className="font-semibold">
                                        {formatNumber(propertyStats?.totalProperties ?? 0)}
                                    </span>
                                </p>
                                <p className="pt-2 border-t text-xs">
                                    Bạn có thể mở rộng thêm các API (ví dụ: lịch sử thanh toán
                                    chi tiết) để hiển thị bảng giao dịch real-time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;

import { LayoutDashboard, Locate, Truck, Users } from "lucide-react";
// Admin Sidebar
export const AdminSideBarContent = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Shipment", path: "/shipment", icon: Truck },
    { name: "Tracking", path: "/tracking", icon: Locate },
    { name: "Staff", path: "/staff", icon: Users },
];
// Coordinator Sidebar
export const CoordinatorSideBarContent = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Shipment", path: "/shipment", icon: Truck },
    { name: "Tracking", path: "/tracking", icon: Locate },
];
// Operator Sidebar
export const OperatorSideBarContent = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tracking", path: "/tracking", icon: Locate },
];

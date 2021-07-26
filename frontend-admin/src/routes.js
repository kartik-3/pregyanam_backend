
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Book from '@material-ui/icons/Book';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import SlotList from "views/Slot/SlotList";
import AccessTimeIcon from '@material-ui/icons/AccessTime';

//done
import AdminList from "views/AdminList/AdminList";
import BlogList from "views/Blog/BlogList";
import AppointmentList from "views/Appointment/AppointmentList";

import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
import Resource from "views/Resource/Resource";
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/admin-list",
    name: "All Admins",
    icon: Person,
    component: AdminList,
    layout: "/admin",
  },
  {
    path: "/blog",
    name: "Blogs",
    icon: Book,
    component: BlogList,
    layout: "/admin",
  },
  {
    path: "/slot",
    name: "Slot Creation",
    icon: AccessTimeIcon,
    component: SlotList,
    layout: "/admin",
  },
  {
    path: "/appointment",
    name: "Appointments",
    icon: "content_paste",
    component: AppointmentList,
    layout: "/admin",
  },
  // {
  //   path: "/resource",
  //   name: "Resource",
  //   icon: LibraryBooks,
  //   component: Resource,
  //   layout: "/admin",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: BubbleChart,
  //   component: TableList,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin",
  // },
];

export default dashboardRoutes;

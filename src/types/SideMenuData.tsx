import { AiOutlineDashboard, AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import type { MenuItemType } from "./userType";
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { getUserFromToken } from "../service/ApiClient";
import { MdOutlineClass, MdWeb } from "react-icons/md";

const commonMenu: MenuItemType[] = [
    { label: "Dashboard", icon: AiOutlineDashboard, path: "landingPage" },
    { label: "List All Courses", icon: AiOutlineTeam, path: "listAllCourse" },
    { label: "Ongoing Classes", icon: FaSchool, path: "school" },
    { label: "Enrol Your Ward", icon: AiOutlineUser, path: "profile" },
];

const teacherMenu: MenuItemType[] = [

    { label: "Teacher", icon: FaChalkboardTeacher, path: "classTeacher" },

    { label: "Upload Assignment", icon: AiOutlineDashboard, path: "classTeacher/publish" },
    { label: "Publish Course", icon: AiOutlineDashboard, path: "/db2/publishCourse" },
    { label: "SetUp Meeting", icon: AiOutlineDashboard, path: "classTeacher/createZoomMeeting" },
    { label: "My upcoming Meeting", icon: AiOutlineDashboard, path: "classTeacher/myUpcomingMeetings" }
]

const adminMenu: MenuItemType[] = [
    { label: "User Details", icon: AiOutlineUser, path: "userdetails" },
    { label: "Edit Role", icon: MdWeb, path: "editRole" },
    { label: "Class room", icon: MdOutlineClass, path: "classroom" },
];



export const getMenuByRoles = (): MenuItemType[] => {

    // const user = getUserFromToken();
    const roles = getUserFromToken()?.roles || [];
    console.log("User roles:", roles);
    let menu: MenuItemType[] = [...commonMenu];

    if (roles.includes("ROLE_TEACHER")) {
        menu.push(...teacherMenu);
    }

    if (roles.includes("ROLE_ADMIN")) {
        menu.push(...adminMenu);
    }


    const uniqueMenu = Array.from(
        new Map(menu.map(item => [item.path, item])).values()
    );

    return uniqueMenu;
};
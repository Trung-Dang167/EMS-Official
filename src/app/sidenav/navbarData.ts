import { INavbarData } from "./helper";

export const navbarData : INavbarData[]= [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard',

    },
    {
        routeLink: 'trend',
        icon: 'fal fa-chart-bar',
        label: 'Trend',
    },
    {
        routeLink: 'alarm',
        icon: 'fal fa-bell',
        label: 'Alarm',

    },
    {
        routeLink: 'setting',
        icon: 'fal fa-cog',
        label: 'Settings',
        expanded: false,
        items: [
            {
                routeLink: 'setting/customize',
                label: 'Settings'
            },
            {
                routeLink: 'login',
                label: 'Log Out',
            }
        ]
    }  
]
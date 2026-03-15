import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { routes } from "../routes/routes";

function PageTitle() {
    const location = useLocation();

    useEffect(() => {
        const currentRoute = routes.find(
            route => route.path === location.pathname
        );

        if (currentRoute) {
            document.title = currentRoute.title;
        }
    }, [location]);

    return null;
}

export default PageTitle;
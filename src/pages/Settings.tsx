import {Link} from "react-router-dom";

function Settings() {
    return (
        <div>
            <h1>Settings Page</h1>
            <p>This is the settings page</p>
            <Link to="/">Go back home</Link>
        </div>
    );
}

export default Settings;

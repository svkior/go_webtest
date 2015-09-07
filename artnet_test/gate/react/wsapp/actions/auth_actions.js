/**
 * Created by svkior on 11/08/15.
 */

import Reflux from 'reflux';


var AuthActions = Reflux.createActions([
    // Посыл сделать логин
    "doLogin",
    // Посыл разлогиниться
    "doLogout",
    // Возврат - залогинились
    "loggedIn",
    // Возврат - разлогинились
    "loggedOut",
    // Диспечер сообщений от WS
    "gotMessage"
]);

export default AuthActions
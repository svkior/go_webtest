/**
 * Created by s.kior on 23.07.2015.
 */
import Reflux from 'reflux';

var WSActions = Reflux.createActions([
    "sendMessage",  // Послать сообщение по каналу. Должно быть {}. Функция сама делает JSON.Stringify
    "connected",    // Экшн вызывается, если соединение установлено
    "disconnected"  // Экшн вызывается, если соединение разорвано
]);

export default WSActions;
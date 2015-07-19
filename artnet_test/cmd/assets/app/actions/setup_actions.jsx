
/** @jsx React.DOM **/

var Reflux = require('reflux');


var SetupActions = Reflux.createActions([
    "setIp", // Изменить IP Адрес
    "setMask",
    "setGw",
    "setMac",
    "toggleArtIn",
    "toggleArtOut",
    "addArtIn",
    "addArtOut",
    "removeArtIn",
    "removeArtOut",
    "editArtIn",
    "editArtOut",
    "uploadEthernet", // Закачать параметры Ethernet в прибор
    "uploadArtIns",   // Закачать Входы ArtNet
    "uploadArtOuts"   // Закачать Выходы ArtNet
]);

module.exports.SetupActions = SetupActions;

/** @jsx React.DOM **/

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


var SetupStore = Reflux.createStore({
    listenables: [SetupActions],
    onSetIp: function(newIp){
        //console.log("Want to change newIp");
        this.setup.Eth.IpAddress = newIp;
        this.updateSetup(this.setup);
    },
    onSetMask: function(newMask){
        //console.log("Want to change newMask");
        this.setup.Eth.IpMask = newMask;
        this.updateSetup(this.setup);
    },
    onSetGw: function(param){
        //console.log("XXX: ",param);
        this.setup.Eth.IpGw = param;
        this.updateSetup(this.setup);
    },
    onSetMac: function(param){
        //console.log("XXX: ",param);
        this.setup.Eth.Mac = param;
        this.updateSetup(this.setup);
    },
    onToggleArtIn: function(param, idx){
        //console.log("XXX: ",param, ", idx:", idx);
        this.setup.ArtIns[idx].Enabled = param;
        this.updateSetup(this.setup);
    },
    onToggleArtOut: function(param, idx){
        //console.log("XXX: ",param);
        this.setup.ArtOuts[idx].Enabled = param;
        this.updateSetup(this.setup);
    },
    onAddArtIn: function(param){
        //console.log("XXX: ",param);
        this.setup.ArtIns.push({
            Enabled: false,
            Universe: 0,
            Name: "tag" + this.setup.ArtIns.length
        });
        this.updateSetup(this.setup);
    },
    onAddArtOut: function(param){
        //console.log("XXX: ",param);
        this.setup.ArtOuts.push({
            Enabled: false,
            Universe: 0,
            Name: "tag" + this.setup.ArtOuts.length
        });
        this.updateSetup(this.setup);
    },
    onRemoveArtIn: function(param){
//        console.log("XXX: ",param);
        this.setup.ArtIns.remove(param);
        this.updateSetup(this.setup);
    },
    onRemoveArtOut: function(param){
//        console.log("XXX: ",param);
        this.setup.ArtOuts.remove(param);
        this.updateSetup(this.setup);
    },
    onEditArtIn: function(param, idx){
        //console.log("XXX: ",param);
        this.setup.ArtIns[idx].Universe = isNaN(parseInt(param)) ? param : parseInt(param);
        this.updateSetup(this.setup);
    },
    onEditArtOut: function(param, idx){
        //console.log("XXX: ",param);
        this.setup.ArtOuts[idx].Universe = isNaN(parseInt(param)) ? param : parseInt(param);
        this.updateSetup(this.setup);
    },
    updateSetup: function(setup){
        //console.log("Update Setup: ", setup);
        this.setup = setup;
        this.trigger(setup);
    },
    setupUrl: '/api/status',
    fetchSetup: function(){
        $.ajax({
            url: window.location.protocol + "//" + window.location.host + this.setupUrl,
            dataType: 'json',
            cache: false,
            success: function (result) {
                this.setup = result;
                this.trigger(this.setup);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error("/api/status", status, err.toString());
            }.bind(this)
        });
    },
    uploadContent: function(url, data){
        var fullUrl = window.location.protocol + "//" + window.location.host + url;
        $.ajax({
            type: "POST",
            url: fullUrl,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async: true,
            data: JSON.stringify(data),
            success: function(result){
                this.setup = result;
                this.trigger(this.setup);
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err.toString());
                //console.error(xhr.responseText, status, err.toString());
            }.bind(this)
        });

    },
    onUploadEthernet: function(){
        this.uploadContent("/api/setup/ethernet", this.setup.Eth);
    },
    onUploadArtIns: function(){
        this.uploadContent("/api/setup/artin", this.setup.ArtIns);
    },
    onUploadArtOuts: function(){
        this.uploadContent("/api/setup/artout", this.setup.ArtOuts);
    },
    getInitialState: function() {
        return this.setup;
    },
    init: function(){
        this.fetchSetup();
    }

});

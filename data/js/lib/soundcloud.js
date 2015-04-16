
function pageLoaded() {
    var iframeElement   = document.querySelector('iframe');
    var widget = SC.Widget(iframeElement);
    widget.bind(SC.Widget.Events.READY,function(){ //When player is ready, attach an event
        widget.bind(SC.Widget.Events.PLAY,function(){ //When song starts playing
            widget.seekTo(state.SCoffsetMilliseconds);
            widget.unbind(SC.Widget.Events.PLAY); //Remove event, to avoid problems when playing is paused and then restarted
        });
    });

}


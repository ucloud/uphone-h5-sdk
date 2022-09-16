function resizeView(this_) {
    var ratio = this_.ratio;
    if (this_.timer) clearTimeout(this_.timer);
    this_.timer = setTimeout(() => {
      if (
        this_.clientHeight > document.documentElement.clientHeight &&
        this_.fullheight > document.documentElement.clientHeight
      ) {
        this_.clientHeight = document.documentElement.clientHeight;
        this_.fullheight = this_.clientHeight;
        this_.fullwidth = this_.fullheight / ratio;
      }
      if (
        this_.clientHeight <= document.documentElement.clientHeight &&
        this_.fullheight <= document.documentElement.clientHeight
      ) {
        this_.clientHeight = document.documentElement.clientHeight;
        var viewwidth = this_.clientHeight / ratio;
        if (viewwidth < document.documentElement.clientWidth) {
          this_.fullheight = this_.clientHeight;
          this_.fullwidth = this_.fullheight / ratio;
        } else {
          this_.clientWidth = document.documentElement.clientWidth;
          this_.fullwidth = this_.clientWidth;
          this_.fullheight = this_.fullwidth * ratio;
        }
      }
      if (
        this_.clientWidth > document.documentElement.clientWidth &&
        this_.fullwidth > document.documentElement.clientWidth
      ) {
        this_.clientWidth = document.documentElement.clientWidth;
        this_.fullwidth = this_.clientWidth;
        this_.fullheight = this_.fullwidth * ratio;
      }
      if (
        this_.clientWidth < document.documentElement.clientWidth &&
        this_.fullwidth < document.documentElement.clientWidth
      ) {
        this_.clientWidth = document.documentElement.clientWidth;
        var viewheight = this_.clientWidth * ratio;
        if (viewheight < document.documentElement.clientHeight) {
          this_.fullwidth = this_.clientWidth;
          this_.fullheight = this_.fullwidth * ratio;
        } else {
          this_.clientHeight = document.documentElement.clientHeight;
          this_.fullheight = this_.clientHeight;
          this_.fullwidth = this_.fullheight / ratio;
        }
      }
    }, 500);
  }
export default resizeView
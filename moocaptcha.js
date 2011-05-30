var MooCaptcha, $moocaptcha;

if(!window.$empty) {
  var $empty = window.$empty = function() { };
}

(function($,$$) {

MooCaptcha = new Class({

	Implements:[Options,Events]

});

MooCaptcha.extend({

	onReady:$empty,
	onLoading:$empty,

  PUBLIC_KEY : '...',

	register:function(inst) {
		if(!this.instances) {
			this.instances = [];
		}
		this.instances.push(inst);
	},

	listen:function(options) {
		var instances = $$('.moocaptcha') || [];
		instances.each(function(capt) {
			new MooCaptcha(capt,options);
		});
	},

	unload:function() {
		var instances = $$('.moocaptcha') || [];
		instances.each(function(capt) {
			var captcha = capt.retrieve('MooCaptcha');
			if(captcha) {
				captcha.destroy();
			}
		});
		this.instances = [];
	},

  isScriptIncluded : function() {
    return !! window.Recaptcha;
  },

	query:function(id) {
    return $(id).retrieve('MooCaptcha');
	},

  onReady : function() {

  }

});

$moocaptcha = MooCaptcha.query.bind(MooCaptcha);

MooCaptcha.implement({

	options:{
		publicKey:MooCaptcha.PUBLIC_KEY,
    downloadLibraries : true,
		theme:'clean',
    lang:'en',
    showWhenReady : true,
    fadeWhenReady : true,
    tabIndex : null,
    customTranslations : {}
	},

	initialize:function(container,options) {
		this.container = $(container);
		if(this.container.retrieve('MooCaptcha')) return;
		this.container.store('MooCaptcha',this);
		this.setOptions(options);
    this.loading = false;
		this.$build();
		this.hide();
		MooCaptcha.register(this);
	},

	$build:function() {

		this.$onLoading();

    if(!MooCaptcha.isScriptIncluded()) {
      if(this.options.downloadLibraries) {
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.id = 'google-recaptcha-script';
        this.script.src = 'http://www.google.com/recaptcha/api/js/recaptcha_ajax.js';
        this.script.onload = this.$jsOnLoad.bind(this);
        this.script.onerror = this.$jsOnError.bind(this);
        this.script.onreadystatechange = this.$jsOnStateChange.bind(this);
        document.getElement('head').adopt(this.script);
        this.$jsOnRequest();
      }
      else {
        this.$onMissingLibraries();
      }

      return;
    }

		this.recaptcha = Recaptcha.create(this.getPublicKey(),this.getContainer(),{
			theme:this.getTheme(),
		  callback:this.$onReady.bind(this),
      tabindex:this.options.tabindex,
      lang:this.options.lang,
      custom_translations:this.options.customTranslations
		});

	},

  $jsOnRequest : function() {
    this.$jsOnRequest = $empty;
    this.$event('libraryDownload');
  },

  $jsOnLoad : function() {
    if(MooCaptcha.isScriptIncluded()) {
      this.$event('libraryReady');

      //override the methods to set events
      Recaptcha._reload = Recaptcha.reload.bind(Recaptcha);
      Recaptcha.reload = this.renew.bind(this);

      this.$build();
    }
    else {
      this.$jsOnError();
    }
  },

  $jsOnError : function() {
    this.$event('libraryError');
  },

  $jsOnStateChange : function() {
    var script = this.script;
    var state = script.readyState;
    if(state == 'loading') {
      this.$jsOnRequest();
    }
    else if(state == 'loaded' || state=='complete' || state == 'interactive') {
      this.$jsOnStateChange = $empty;
      this.$jsOnLoad();
    }
    else {
      this.$jsOnStateChange = $empty;
      this.$jsOnError();
    }
  },

  getID:function() {
    return this.getContainer.id;
  },

  setID:function(name) {
    this.getContainer().id = id;
  },

	hide:function() {
		this.getContainer().setStyle('display','none');
	},

	show:function() {
		this.getContainer().setStyle('display','block');
	},

  fadeIn:function() {
    if(this.isHidden()) {
      var c = this.getContainer();
      c.setStyle('opacity',1);
      this.show();
      c.fade('in');
    }
  },

  fadeOut:function() {
    if(this.isVisible()) {
      this.getContainer().get('tween').start('opacity',0).chain(this.hide.bind(this));
    } 
  },

  isHidden:function() {
    return this.getContainer().getStyle('display') == 'none';
  },

  isVisible:function() {
    return this.getContainer().getStyle('display') == 'block';
  },

  isReady:function() {
    return !! this.ready;
  },

  isLoading:function() {
    return !! this.loading;
  },

  isEmpty:function() {
    return (this.getInput().get('value') || '').trim().length == 0;
  },

  getInput:function() {
    return this.getContainer().getElement('input#recaptcha_response_field');
  },

	getContainer:function() {
		return this.container;
	},

  toElement:function() {
    return this.getContainer();
  },

	getForm:function() {
		return this.getContainer().getParent('form');
	},

	getTheme:function() {
		return this.options.theme;
	},

	getPublicKey:function() {
		return this.options.publicKey;
	},

  showWhenReady:function() {
    return !! this.options.showWhenReady;
  },

  fadeWhenReady:function() {
    return !! this.options.fadeWhenReady;
  },

  renew:function() {
    Recaptcha._reload();
    this.$event('renew');
  },

	destroy:function() {
		this.container.destroy();
	},

  $onFocus : function() {
    this.$event('focus');
  },

  $onBlur : function() {
    this.$event('blur');
  },

	$onLoading:function() {
		this.$event('loading');
    this.loading = true;
	},

	$onReady:function() {
    this.getInput().addEvents({
      blur : this.$onBlur.bind(this),
      focus : this.$onFocus.bind(this)
    });

		MooCaptcha.onReady(this);
		this.$event('ready');
    this.ready = true;
    this.loading = false;
    if(this.fadeWhenReady()) {
      this.fadeIn();
    }
    else if(this.showWhenReady()) {
		  this.show();
    }
	},

  $onMissingLibraries:function() {
    this.$event('missingLibraries');
  },

	$event:function(event,args) {
		MooCaptcha.onLoading(this);
		this.fireEvent(event,args);
	}

});

})(document.id,$$);

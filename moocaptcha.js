var MooCaptcha, $moocaptcha;

(function($,$$) {

var PUBLIC_KEY = '6Lc8d70SAAAAAFADJK0v-4J1HueaojqOolNfJoEh';

MooCaptcha = new Class({

	Implements:[Options,Events]

});

MooCaptcha.extend({

	onReady:$empty,
	onLoading:$empty,

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

	query:function() {
		return this.instances.last;
	}

});

$moocaptcha = MooCaptcha.query.bind(MooCaptcha);

MooCaptcha.implement({

	options:{
		publicKey:PUBLIC_KEY,
		theme:'clean'
	},

	initialize:function(container,options) {
		this.container = $(container);
		if(this.container.retrieve('MooCaptcha')) return;
		this.container.store('MooCaptcha',this);
		this.setOptions(options);
		this.build();
		this.hide();
		MooCaptcha.register(this);
	},

	build:function() {
		this.recaptcha = Recaptcha.create(this.getPublicKey(),this.getContainer(),{
			theme:this.getTheme(),
		  callback:this.$onReady.bind(this)
		});
		this.$onLoading();
	},

	hide:function() {
		this.getContainer().setStyle('display','none');
	},

	show:function() {
		this.getContainer().setStyle('display','block');
	},

	getContainer:function() {
		return this.container;
	},

	getElement:function() {
		return this.getContainer();
	},

	getForm:function() {
		return this.getContainer().getParent('form');
	},

	setPublicKey:function(key) {
		this.options.publicKey = key;
	},

	getPublicKey:function() {
		return this.options.publicKey;
	},

	setTheme:function(theme) {
		this.options.theme = theme;
	},

	getTheme:function() {
		return this.options.theme;
	},

	getPublicKey:function() {
		return this.options.publicKey;
	},

  renew:function() {
    Recaptcha.reload();
  },

	destroy:function() {
		this.container.destroy();
	},

	$onLoading:function() {
		this.$event('loading');
	},

	$onReady:function() {
		MooCaptcha.onReady(this);
		this.$event('ready');
		this.show();
	},

	$event:function(args) {
		MooCaptcha.onLoading(this);
		this.fireEvent('event',args);
	}

});

})(document.id,$$);

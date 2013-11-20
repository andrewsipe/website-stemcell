var SCAC = SCAC || {};
SCAC.router = SCAC.router || {
	
	route: function() {
        var hash = window.location.hash.slice(1);
        switch(hash) {
                case 'music':
                        // route to music section
                        console.log('loading music');
                break;
                case 'video':
                        // route to video section
                        console.log('loading video');
                break;
                case 'news':
                        // route to news
                        console.log('loading news');
                break;
                case 'contact':
                        // route to contact
                        console.log('loading contact');
                break;
                case 'about':
                        // route to about
                        console.log('loading about');
                break;
                default:
                        // route to home
                        console.log('default to home');
                break;        
        }               
    },
    
    pathTo: function(pathFromThemeRoot) {
        var basePath = 'http://www.stemcellcurriculum.org/wp-content/themes/scac/';
        return basePath + pathFromThemeRoot;
    } 
	
};

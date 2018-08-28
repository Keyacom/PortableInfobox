(function (window, $) {
	'use strict';

	var MediaCollection = {
		init: function($content) {
			var $mediaCollections = $content.find('.pi-media-collection');

			$mediaCollections.each( function( index ) {
				var $collection = $mediaCollections.eq(index),
					$tabs = $collection.find('ul.pi-media-collection-tabs li'),
					$tabContent = $collection.find('.pi-media-collection-tab-content');

				$tabs.click( function() {
					var $target = $(this),
						tabId = $target.attr('data-pi-tab');

					$tabs.removeClass('current');
					$tabContent.removeClass('current');

					$target.addClass('current');
					$collection.find('#' + tabId).addClass('current');
				});
			});
		}
	};

	var CollapsibleGroup = {
		init: function($content) {
			var $collapsibleGroups = $content.find('.pi-collapse');

			$collapsibleGroups.each( function( index ) {
				var $group = $collapsibleGroups.eq(index),
					$header = $group.find('.pi-header:first');

				$header.click( function() {
					$group.toggleClass('pi-collapse-closed');

					// SUS-3245: lazy-load any images in the un-collapsed section
					$(window).trigger('scroll');
				});
			});
		}
	};

	var TemplateDataSuggestions = {
		init: function() {
			var original = mw.TemplateData.SourceHandler.prototype.extractParametersFromTemplateCode;
			mw.TemplateData.SourceHandler.prototype.extractParametersFromTemplateCode = function( templateCode ) {
				var infobox, source,
					params = original(templateCode),
					infoboxRegex = /<infobox.*?<\/infobox>/gs,
					sourceRegex = /<[^<\/>]*? source="([^"]*)"[^>]*>/g;

				while( ( infobox = infoboxRegex.exec(templateCode) ) !== null ) {
					while( ( source = sourceRegex.exec(infobox) ) !== null ) {
						if ( $.inArray( source[1], params ) === -1 ) {
							params.push( source[1] );
						}
					}
				}

				return params;
			}
		}
	}

	mw.hook('wikipage.content').add(function($content) {
		MediaCollection.init($content);
		CollapsibleGroup.init($content);
	});
	mw.loader.using('ext.templateDataGenerator.data').then(function() {
		TemplateDataSuggestions.init();
	});
})(window, jQuery);

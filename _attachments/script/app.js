function drawEvents() {
	db.view(design + "/recent_events", {
		descending : "true",
		limit : 5,
		update_seq : true,
		success : function(data) {
			var them = $.mustache($("#recent-events").html(), {
				events : data.rows.map(function(r) {return r.value;})
			});
			$("#recent_events").html(them);
		}
	});
};

function addRootNode() {
	var keyBox = $('#rootKey');
	var key = keyBox.val();
	keyBox.val('');
	$('#properties').append($.mustache($("#event-node").html(), { key : key }));
}

function addNode(node) {
	lastNode = node;
	var parent = $(node).parent();
	var keyBox = parent.children('input[name=key]');
	var key = keyBox.val();
	keyBox.val('');
	parent.children('ul').append($.mustache($("#event-node").html(), { key : key }));
}

function addList(node) {
	lastNode = node;
	var parent = $(node).parent();
	var keyBox = parent.children('input[name=key]');
	var key = keyBox.val();
	keyBox.val('');
	parent.children('ul').append($.mustache($("#event-list").html(), { key : key }));
}

function addListValue(node) {
	lastNode = node;
	var parent = $(node).parent();
	var valueBox = parent.children('input[name=value]');
	var value = valueBox.val();
	valueBox.val('');
	parent.children('ul').append($.mustache($("#event-list-value").html(), { value : value }));
}

function addValue(node) {
	lastNode = node;
	var parent = $(node).parent();
	var keyBox = parent.children('input[name=key]');
	var key = keyBox.val();
	keyBox.val('');
	var valueBox = parent.children('input[name=value]');
	var value = valueBox.val();
	valueBox.val('');
	parent.children('ul').append($.mustache($("#event-value").html(), { key : key, value : value }));
}

function removeNode(node) {
	$(node).parent().remove();
}

function getKey(node) {
	return $(node).children('span.key').text();
}

function getValue(node) {
	return $(node).children('span.value').text();
}

function extractNode(nodePrimative) {
	var node = $(nodePrimative);
	if (node.hasClass('eventNode')) {
		var result = {};
		node.children('ul').children().each(function(key,node){
			var temp = extractNode(node);
			if (temp) {
				result[temp[0]] = temp[1];
			}
		});
		return [ getKey(node), result ];
	}
	
	if (node.hasClass('eventList')) {
		var result = [];
		node.children('ul').children('.eventListValue').each(function(key,node){
			var temp = getValue(node);
			if (temp) {
				result.push(temp);
			}
		});
		return [ getKey(node), result ];
	}
	
	if (node.hasClass('eventValue')) {
		return [ getKey(node), getValue(node) ];
	}
	console.warning("Unknown node type");
	return null;
}

var design, db;
$(function() {
	var path = unescape(document.location.pathname).split('/');
	design = path[3];
	db = $.couch.db(path[1]);
		newEvent = {};
	{
		var now = new Date();
		var month = now.getMonth() + 1;
		if (month < 10) { month = '0' + month; }
		var day = now.getDate();
		if (day < 10) { day = '0' + day; }
		$('#when_date').val(now.getFullYear()+"-"+month+ "-"+day);
		$('#when_hour').val(now.getHours());
		$('#when_min').val(now.getMinutes());
	}
	drawEvents();
});

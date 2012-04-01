var design, db;
$(function() {
	var path = unescape(document.location.pathname).split('/');
	design = path[3];
	db = $.couch.db(path[1]);
	if (window.bootstrap) { window.bootstrap(); }
});

function addRootNode() {
	var keyBox = $('#rootKey');
	var key = keyBox.val();
	keyBox.val('');
	$('#properties').append($.mustache($("#event-node-object").html(), { key : key }));
}

function addNode(node) {
	lastNode = node;
	var parent = $(node).parent();
	var keyBox = parent.children('input[name=key]');
	var key = keyBox.val();
	keyBox.val('');
	parent.children('ul').append($.mustache($("#event-node-object").html(), { key : key }));
}

function addList(node) {
	lastNode = node;
	var parent = $(node).parent();
	var keyBox = parent.children('input[name=key]');
	var key = keyBox.val();
	keyBox.val('');
	parent.children('ul').append($.mustache($("#event-node-list").html(), { key : key }));
}

function addListValue(node) {
	lastNode = node;
	var parent = $(node).parent();
	var valueBox = parent.children('input[name=value]');
	var value = valueBox.val();
	valueBox.val('');
	parent.children('ul').append($.mustache($("#event-node-list-value").html(), { value : value }));
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
	parent.children('ul').append($.mustache($("#event-node-value").html(), { key : key, value : value }));
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

function fill(number) {
	if (number <= 9) { return "0"+number; }
	return ""+number;
}

function initDate() {
	var now = new Date();
	$("#when-date").val(now.getFullYear()+"-"+fill(now.getMonth() + 1)+ "-"+fill(now.getDate()));
	var fillSelect = function(element, max, current) {
		for (var i = 0; i < max; i++) {
			var temp = fill(i);
			if (i == current) {
				temp = '<option selected>'+temp+'</option>';
			} else {
				temp = '<option>'+temp+'</option>';
			}
			element.append(temp);
		}
	}
	fillSelect($("#when-hour"), 24, now.getHours());
	fillSelect($("#when-min"), 60, now.getMinutes());
}
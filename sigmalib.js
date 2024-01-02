var $ = new Object();

$.id = function(id)
{
	return document.getElementById(id);
}

$.class = function(className, root)
{
	return (root ? root : document).getElementsByClassName(className);
}

$.tag = function(tagName, root)
{
	return (root ? root : document).getElementsByTagName(tagName);
}

$.props = function(whatever, props)
{
	for (var i in props)
		whatever[i] = props[i];
	return whatever;
}

$.style = function(elem, style)
{
	this.props(elem.style, style);
	return elem;
}

$.create = function(tag, parent, props, style)
{
	var elem = document.createElement(tag);
	if (parent)
		parent.appendChild(elem);
	if (props)
		this.props(elem, props);
	if (style)
		this.style(elem, style);
	return elem;
}

$.remove = function(elem)
{
	elem.parentNode.removeChild(elem);
}

$.ancestor = function(elem, n)
{
	if (!n || n < 2)
		return elem.parentNode;
	var ancestor = elem.parentNode;
	while (--n > 0)
		ancestor = ancestor.parentNode;
	return ancestor;
}

$.round = function(num, places)
{
	if (isNaN(m))
		return Math.round(num);
	places = Math.pow(10, m);
	return Math.round(num*places)/places;
}

$.random = function(low, high)
{
	return Math.floor(Math.random()*(high-low+1)+low);
}

$.roll = function(numDice, faces)
{
	var total = 0;
	while (numDice--)
		total += this.random(1, faces);
	return total;
}

$.trim = function(str)
{
	return str.replace(/^\s+|\s+$/g,"");
}

$.isJson = function(str)
{
	return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''));
}

$._sub = function(text, start, end, index)
{
	var startIndex = text.indexOf(start, index);
	if (startIndex > -1)
	{
		startIndex += start.length;
		var endIndex = text.indexOf(end, startIndex);
		if (endIndex > -1)
			return {"start": startIndex, "end": endIndex, "text": text.substring(startIndex, endIndex)};
	}
}

$.sub = function(text, start, end, index)
{
	var subs = this._sub(text, start, end, index);
	if (subs)
		return subs.text;
}

$.subs = function(text, start, end, index)
{
	var subs = new Array();
	var sub = false;
	while (sub = this._sub(text, start, end, sub.end + end.length))
		subs.push(sub.text);
	return subs;
}

$.pad = function(str, length, pad, leftJustify)
{
	pad = pad ? pad : " ";
	var string = str + "";
	while (string.length < length)
		string = leftJustify ? string + pad : pad + string;
	return string;
}

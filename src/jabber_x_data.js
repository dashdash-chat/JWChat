function genJabberXDataTable(x) {
	var html = '<input type=hidden name="jwchat_form_type" value="jabber:x:data">';

	if (x.title)
		html += "<h1>"+x.title.replace(/\n/g,"<br>")+"</h1>";
	if (x.instructions)
		html += x.instructions.replace(/\n/g,"<br>");

	if (!x.o)
		return html;

	html += '<table width="100%">';
	for (var i in x.o) {
		if (x.o[i].tagname != 'field')
			continue;
 		html += "<tr>";
		switch (x.o[i].type) {
		case 'hidden':
			html += "<td colspan=2><input type=hidden name='"+x.o[i].far+"' value='"+x.o[i].value+"'></td>";
			break;
		case 'fixed':
			html += "<td colspan=2><b>"+x.o[i].value+"</b></td>";
			break;
		case 'text-single':
			html += "<th>" + x.o[i].label + "</th>";
			html += "<td>";
			html += "<input type=text size='24' name='" + x.o[i].far + "'";
			if (x.o[i].value)
				html += " value='" + x.o[i].value + "'";
			html += ">";
			html += "</td>";
			break;
		case 'text-private':
			html += "<th>" + x.o[i].label + "</th>";
			html += "<td>";
			html += "<input type=password size='24' name='" + x.o[i].far + "'";
			if (x.o[i].value)
				html += " value='" + x.o[i].value + "'";
			html += ">";
			html += "</td>";
			break;
		case 'text-multi':
			html += "<th valign=top>" + x.o[i].label + "</th>";
			html += "<td>";
			html += "<textarea cols=24 rows=4 name='" + x.o[i].far + "'>";
			if (x.o[i].value)
				html += x.o[i].value;
			html += "</textarea>";
			html += "</td>";
			break;
		case 'list-single':
			html += "<th>" + x.o[i].label + "</th>";
			html += "<td>";
			html += "<select name='" + x.o[i].far + "'>";
			if (x.o[i].o) {
				for (var j in x.o[i].o) {
					if (x.o[i].o[j].tagname == 'option') {
						html += "<option value='" + x.o[i].o[j].value + "'";
						if (x.o[i].value == x.o[i].o[j].value)
							html += " selected";
						html += ">"+x.o[i].o[j].label+"</option>";
					}
				}
			}
			html += "</select>";
			html += "</td>";
			break;
		case 'boolean':
			html += "<th>" + x.o[i].label + "</th>";
			html += "<td>";
			html += "<input type=checkbox name='" + x.o[i].far + "'";
			if (x.o[i].value == '1')
				html += " checked";
			html += ">";
			html += "</td>";
			break;
		default:
			srcW.Debug.log("unknown type: " + x.o[i].type,1);
			break;
		}
 		html += "</tr>";
	}
	html += "</table>";

	return html;
}

function genJabberXDataReply(form) {
	var xml = "<x xmlns='jabber:x:data' type='submit'>";

	var els = form.elements;
	for (var i=0; i<els.length; i++) {
		if (els[i].name == '' || els[i].value == '' || els[i].name == 'jwchat_form_type')
			continue;
		xml += "<field var='" +els[i].name + "'><value>";
		if (els[i].type == 'checkbox')
			xml += (els[i].checked) ? '1':'0';
		else
			xml += els[i].value;
		xml += "</value></field>";
	}

	xml += "</x>";

	return xml;
}

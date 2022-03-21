<script>
var sublist_internalid = 'custpage_transaction_list_splits'
function printSublist(sublist_internalid) {
	var printPDFButton = document.getElementById('custpage_print_sublist')
			.addEventListener("click", function() {
				var table = document.getElementById(sublist_internalid)
				var fullHeader = document.title
				var fullHeaderArr = fullHeader.split('-')
				var header = fullHeaderArr[0]
				var mywindow = window.open('', 'PRINT', 'height=400,width=600');
				mywindow.document.write('<html><head>' + document.title + '</title>');
				mywindow.document.write('</head><style>  table {table-layout: fixed; border-collapse: collapse;}  '  + 
						 '           table th { background-color: #d3d3d3;   color: white; padding-bottom: 10px; padding-top: 10px;}  '  + 
						 '           table td {  border: 1px solid black; text-overflow: ellipsis; word-wrap:break-word; text-align:center; padding: 5px; page-break-inside: avoid;};  '+ 
						 	'table tr {page-break-inside: avoid;}' + 
					 		' </style><body > ');
				mywindow.document.write('<h1>' + header + '</h1>');
				//mywindow.document.write(header.outerHTML);
				mywindow.document.write(table.outerHTML);
				mywindow.document.write('</body></html>');
				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10*/
				mywindow.print();
				mywindow.close();
				return true;
			});
}
window.onload = printSublist(sublist_internalid);
</script>

var sublist_internalid="custpage_transaction_list_splits";function printSublist(t){document.getElementById("custpage_print_sublist").addEventListener("click",function(){var e=document.getElementById(t),i=document.title.split("-")[0],d=window.open("","PRINT","height=400,width=600");return d.document.write("<html><head>"+document.title+"</title>"),d.document.write("</head><style>  table {                 table-layout: fixed;                 border-collapse: collapse;             }             table th {                 background-color: #d3d3d3;                 color: white;                 padding-bottom: 10px;                 padding-top: 10px;                              }                  table td {              border: 1px solid black;                 text-overflow: ellipsis;                    word-wrap:break-word;                    text-align:center;                    padding: 5px;   \t\t\t\tpage-break-inside: avoid;           };  table tr {page-break-inside: avoid;} </style><body > "),d.document.write("<h1>"+i+"</h1>"),d.document.write(e.outerHTML),d.document.write("</body></html>"),d.document.close(),d.focus(),d.print(),d.close(),!0})}window.onload=printSublist(sublist_internalid);
 

"<script>\nvar sublist_internalid = 'custpage_transaction_list_splits'\nfunction printSublist(sublist_internalid) {\n\tvar printPDFButton = document.getElementById(sublist_internalid)\n\t\t\t.addEventListener(\"click\", function() {\n\t\t\t\tvar table = document.getElementById(sublist_internalid)\n\t\t\t\tvar fullHeader = document.title\n\t\t\t\tvar fullHeaderArr = fullHeader.split('-')\n\t\t\t\tvar header = fullHeaderArr[0]\n\t\t\t\tvar mywindow = window.open('', 'PRINT', 'height=400,width=600');\n\t\t\t\tmywindow.document.write('<html><head>' + document.title + '</title>');\n\t\t\t\tmywindow.document.write('</head><style>  table {table-layout: fixed; border-collapse: collapse;}  '  + \n\t\t\t\t\t\t '           table th { background-color: #d3d3d3;   color: white; padding-bottom: 10px; padding-top: 10px;}  '  + \n\t\t\t\t\t\t '           table td {  border: 1px solid black; text-overflow: ellipsis; word-wrap:break-word; text-align:center; padding: 5px; page-break-inside: avoid;};  '+ \n\t\t\t\t\t\t \t'table tr {page-break-inside: avoid;}' + \n\t\t\t\t\t \t\t' </style><body > ');\n\t\t\t\tmywindow.document.write('<h1>' + header + '</h1>');\n\t\t\t\t//mywindow.document.write(header.outerHTML);\n\t\t\t\tmywindow.document.write(table.outerHTML);\n\t\t\t\tmywindow.document.write('</body></html>');\n\t\t\t\tmywindow.document.close(); // necessary for IE >= 10\n\t\t\t\tmywindow.focus(); // necessary for IE >= 10*/\n\t\t\t\tmywindow.print();\n\t\t\t\tmywindow.close();\n\t\t\t\treturn true;\n\t\t\t});\n}\nwindow.onload = printSublist(sublist_internalid);\n</script>"

"\n<script>\nvar sublist_internalid = 'custpage_transaction_list_splits'\n\nfunction printSublist(sublist_internalid) {\n\n\tvar printPDFButton = document.getElementById('custpage_print_sublist')\n\t\t\t.addEventListener(\"click\", function() {\n\t\t\t\tvar table = document.getElementById(sublist_internalid)\n\t\t\t\t\n\t\t\t\tvar fullHeader = document.title\n\t\t\t\tvar fullHeaderArr = fullHeader.split('-')\n\t\t\t\tvar header = fullHeaderArr[0]\n\t\n\n\t\t\t\tvar mywindow = window.open('', 'PRINT', 'height=400,width=600');\n\t\t\t\tmywindow.document.write('<html><head>' + document.title + '</title>');\n\t\t\t\tmywindow.document.write('</head><style>  table {  '  + \n\t\t\t\t\t\t '               table-layout: fixed;  '  + \n\t\t\t\t\t\t '               border-collapse: collapse;  '  + \n\t\t\t\t\t\t '           }  '  + \n\t\t\t\t\t\t '           table th {  '  + \n\t\t\t\t\t\t '               background-color: #d3d3d3;  '  + \n\t\t\t\t\t\t '               color: white;  '  + \n\t\t\t\t\t\t '               padding-bottom: 10px;  '  + \n\t\t\t\t\t\t '               padding-top: 10px;  '  + \n\t\t\t\t\t\t '                 '  + \n\t\t\t\t\t\t '           }  '  + \n\t\t\t\t\t\t '     '  + \n\t\t\t\t\t\t '           table td {  '  + \n\t\t\t\t\t\t '            border: 1px solid black;  '  + \n\t\t\t\t\t\t '               text-overflow: ellipsis;  '  + \n\t\t\t\t\t\t '                  word-wrap:break-word;  '  +\n\t\t\t\t\t\t '                  text-align:center;  '  +\n\t\t\t\t\t\t '                  padding: 5px;  '  +\n\t\t\t\t\t\t ' \t\t\t\tpage-break-inside: avoid; ' +\n\t\t\t\t\t\t '          };  '+ \n\t\t\t\t\t\t 'table tr {page-break-inside: avoid;}' + \n\t\t\t\t\t ' </style><body > ');\n\t\t\t\tmywindow.document.write('<h1>' + header + '</h1>');\n\t\t\t\t//mywindow.document.write(header.outerHTML);\n\t\t\t\tmywindow.document.write(table.outerHTML);\n\t\t\t\tmywindow.document.write('</body></html>');\n\t\t\t\tmywindow.document.close(); // necessary for IE >= 10\n\t\t\t\tmywindow.focus(); // necessary for IE >= 10*/\n\t\t\t\tmywindow.print();\n\t\t\t\tmywindow.close();\n\t\t\t\treturn true;\n\t\t\t});\n}\nwindow.onload = printSublist(sublist_internalid);\n</script>"
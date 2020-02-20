'use strict';

// 功能：從 url 獲取數據，數據的格式為 csv 文件，以 TAB 分隔，沒有引號
// 數據包含以下內容：[ID, TRAD, SIMP, IPA_S, IPA_T, JYUTPING, SOUR, EXPL, NOTE]
// 作為參數的 d_char、d_jyutping 是空的 dict
// 獲取數據後，按行分開
// 將 char 作為鍵、line 作為值存入 d_char
// 將 jyutping 作為鍵、line 作為值存入 d_jyutping
async function loadDict(url, d_char, d_char_simp, d_jyutping, d_jyut6ping3) {
	const response = await fetch(url)
		, txt = await response.text()
		, lines = txt.split('\n');
	for (const line of lines) {
		if (!(line.length == 0 || line.startsWith('ID') || line.startsWith('#'))) {
			const char = line.split('\t')[1]
				, char_simp = line.split('\t')[2]
				, jyutping = line.split('\t')[5].slice(0,-1)
				, jyut6ping3 = line.split('\t')[5];
			const res_char = d_char[char]
				, res_char_simp = d_char_simp[char_simp]
				, res_jyutping = d_jyutping[jyutping]
				, res_jyut6ping3 = d_jyut6ping3[jyut6ping3];
			if (!res_char) { d_char[char] = [line]; } else { d_char[char].push(line); }
			if (!res_char_simp) { d_char_simp[char_simp] = [line]; } else { d_char_simp[char_simp].push(line); }
			if (!res_jyutping) { d_jyutping[jyutping] = [line]; } else { d_jyutping[jyutping].push(line); }
			if (!res_jyut6ping3) { d_jyut6ping3[jyut6ping3] = [line]; } else { d_jyut6ping3[jyut6ping3].push(line); }
		}
	}
}

const d_char1994 = {} , d_char_simp1994 = {} , d_jyutping1994 = {} , d_jyut6ping3_1994 = {}
	, loadDict1994 = async () => loadDict('data/1994年謝建猷《南寧白話同音字彙》勘誤.csv', d_char1994, d_char_simp1994, d_jyutping1994, d_jyut6ping3_1994)
	, d_char1997 = {} , d_char_simp1997 = {} , d_jyutping1997 = {} , d_jyut6ping3_1997 = {}
	, loadDict1997 = async () => loadDict('data/1997年楊煥典《南寧話音檔》（原文）勘誤.csv', d_char1997, d_char_simp1997, d_jyutping1997, d_jyut6ping3_1997)
	, d_char1998 = {} , d_char_simp1998 = {} , d_jyutping1998 = {} , d_jyut6ping3_1998 = {}
	, loadDict1998 = async () => loadDict('data/1998年《廣西通誌（漢語方言誌）》勘誤（南寧白話）.csv', d_char1998, d_char_simp1998, d_jyutping1998, d_jyut6ping3_1998)
	, d_char2002 = {} , d_char_simp2002 = {} , d_jyutping2002 = {} , d_jyut6ping3_2002 = {}
	, loadDict2002 = async () => loadDict('data/2002年楊煥典《現代漢語方言音庫字庫》.csv', d_char2002, d_char_simp2002, d_jyutping2002, d_jyut6ping3_2002)
	, d_char2008 = {} , d_char_simp2008 = {} , d_jyutping2008 = {} , d_jyut6ping3_2008 = {}
	, loadDict2008 = async () => loadDict('data/2008年林亦《廣西南寧白話研究》勘誤.csv', d_char2008, d_char_simp2008, d_jyutping2008, d_jyut6ping3_2008)
	, d_char1998p = {} , d_char_simp1998p = {} , d_jyutping1998p = {} , d_jyut6ping3_1998p = {}
	, loadDict1998p = async () => loadDict('data/1998年《廣西通誌（漢語方言誌）》勘誤（南寧亭子平話）.csv', d_char1998p, d_char_simp1998p, d_jyutping1998p, d_jyut6ping3_1998p);

// 功能：將 csv 中的一行變為格式化的 HTML
function formatLine(year, line) {
	const [ID, TRAD, SIMP, IPA_S, IPA_T, JYUTPING, SOUR, EXPL, NOTE] = line.split('\t');
	const pages = SOUR.replace('P','').replace('（單字音表）','').split('，');
	
	if (year=='1994') 
		var bookname = '1994年謝建猷《南寧白話同音字彙》'
		, linkaddr = 'https://gitee.com/leimaau/data-store/raw/master/1994zh/zh'
	else if (year=='1997')
		var bookname = '1997年楊煥典《南寧話音檔》'
		, linkaddr = 'https://gitee.com/leimaau/data-store/raw/master/1997yd/yd'
	else if (year=='1998')
		var bookname = '1998年楊煥典主編《廣西通誌·漢語方言誌》'
		, linkaddr = 'https://gitee.com/leimaau/data-store/raw/master/1998dfz/dfz'
	else if (year=='2002')
		var bookname = '2002年楊煥典《現代漢語方言音庫(字庫)》'
		, linkaddr = 'https://gitee.com/leimaau/data-store/raw/master/2002zk/zk'
	else if (year=='2008')
		var bookname = '2008年林亦、覃鳳餘《廣西南寧白話研究》'
		, linkaddr = 'https://gitee.com/leimaau/data-store/raw/master/2008yj/yj';
	
	var str="", addr="";
	for (var i=0;i<pages.length;i++){
		addr = linkaddr+pages[i]+'.png';
		str += 'P'+'<a href="'+addr+'" target="_Blank">'+pages[i]+'</a>'+'，';
	};
	str = str.replace(/，$/gi,"");
	
	return `<span>
<span>${year}</span>
<!--<span>${ID}</span>-->
<span><a href="javascript:handleSubmit('${TRAD}', 'char')">${TRAD}</a></span>
<span><a href="javascript:handleSubmit('${SIMP}', 'char_simp')">${SIMP}</a></span>
<span>${IPA_S}</span>
<span>${IPA_T}</span>
<span><a href="javascript:handleSubmit('${JYUTPING.slice(0,-1)}', 'jyutping')">${JYUTPING.slice(0,-1)}</a>${JYUTPING.slice(-1)}</span>
<span>${bookname}`+str+`</span>
<span><p data-toggle="tooltip" title="${EXPL}">${EXPL}</p></span>
<span><p data-toggle="tooltip" title="${NOTE}">${NOTE}</p></span>
</span>
`;
}

function dispatchSubmit(val, d1994, d1997, d1998, d2002, d2008, d1998p) {
	const res = [`<span>南寧白話</span><span>
<span>資料</span>
<!--<span>ID</span>-->
<span>繁體</span>
<span>簡體</span>
<span>原文IPA</span>
<span>統一IPA</span>
<span>粵拼</span>
<span>來源</span>
<span>詞例</span>
<span>leimaau附註</span>
</span>
`];

const res2 = [`<span>南寧平話</span><span>
<span>資料</span>
<!--<span>ID</span>-->
<span>繁體</span>
<span>簡體</span>
<span>原文IPA</span>
<span>統一IPA</span>
<span>粵拼</span>
<span>來源</span>
<span>詞例</span>
<span>leimaau附註</span>
</span>
`];

	const pie_data = {}, pie_data2 = {};
	const selval = $('.selectpicker').selectpicker('val');
	const results1994 = d1994[val];
	if (results1994 && selval.indexOf('1994') != '-1')
		for (const line of results1994) {
			res.push(formatLine('1994', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data[JYUTPING]) == "undefined") { pie_data[JYUTPING] = []; pie_data[JYUTPING].push('1994'); } else { pie_data[JYUTPING].push('1994'); };
		}
	const results1997 = d1997[val];
	if (results1997 && selval.indexOf('1997') != '-1')
		for (const line of results1997) {
			res.push(formatLine('1997', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data[JYUTPING]) == "undefined") { pie_data[JYUTPING] = []; pie_data[JYUTPING].push('1997'); } else { pie_data[JYUTPING].push('1997'); };
		}
	const results1998 = d1998[val];
	if (results1998 && selval.indexOf('1998') != '-1')
		for (const line of results1998) {
			res.push(formatLine('1998', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data[JYUTPING]) == "undefined") { pie_data[JYUTPING] = []; pie_data[JYUTPING].push('1998'); } else { pie_data[JYUTPING].push('1998'); };
		}
	const results2002 = d2002[val];
	if (results2002 && selval.indexOf('2002') != '-1')
		for (const line of results2002) {
			res.push(formatLine('2002', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data[JYUTPING]) == "undefined") { pie_data[JYUTPING] = []; pie_data[JYUTPING].push('2002'); } else { pie_data[JYUTPING].push('2002'); };
		}
	const results2008 = d2008[val];
	if (results2008 && selval.indexOf('2008') != '-1')
		for (const line of results2008) {
			res.push(formatLine('2008', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data[JYUTPING]) == "undefined") { pie_data[JYUTPING] = []; pie_data[JYUTPING].push('2008'); } else { pie_data[JYUTPING].push('2008'); };
		}
	outputArea.innerHTML = res.join('\n');
	
	const results1998p = d1998p[val];
	if (results1998p && selval.indexOf('1998p') != '-1')
		for (const line of results1998p) {
			res2.push(formatLine('1998', line));
			var JYUTPING = line.split('\t')[5];
			if (typeof(pie_data2[JYUTPING]) == "undefined") { pie_data2[JYUTPING] = []; pie_data2[JYUTPING].push('2008'); } else { pie_data2[JYUTPING].push('2008'); };
		}
	outputArea2.innerHTML = res2.join('\n');
	pieDiv(pie_data,'container', val);
	pieDiv(pie_data2,'container2', val);
	$(() => { $("[data-toggle='tooltip']").tooltip(); })
}

function handleSubmit(val, queryType) {
	if (queryType == 'char')
		dispatchSubmit(val, d_char1994, d_char1997, d_char1998, d_char2002, d_char2008, d_char1998p);
	else if (queryType == 'char_simp')
		dispatchSubmit(val, d_char_simp1994, d_char_simp1997, d_char_simp1998, d_char_simp2002, d_char_simp2008, d_char_simp1998p);
	else if (queryType == 'jyutping')
		dispatchSubmit(val, d_jyutping1994, d_jyutping1997, d_jyutping1998, d_jyutping2002, d_jyutping2008, d_jyutping1998p);
	else if (queryType == 'jyut6ping3')
		dispatchSubmit(val, d_jyut6ping3_1994, d_jyut6ping3_1997, d_jyut6ping3_1998, d_jyut6ping3_2002, d_jyut6ping3_2008, d_jyut6ping3_1998p);
}

function pieDiv(pie_data, div_id, val){
	var show_data = [];
	for( var i in pie_data ){ pie_data[i] = new Set(pie_data[i]) }; //去重
	for( var i in pie_data ){ show_data.push({name: i, y: pie_data[i].size,x: Array.from(pie_data[i]).toString()}) }; //name 數據名 y 數據值 x 附帶值
	
	var chart = {
	   plotBackgroundColor: null,
	   plotBorderWidth: null,
	   plotShadow: false
	};
	var title = {
	  text: div_id == 'container' ? '南寧白話' + '【' + val + '】' : '南寧平話' + '【' + val + '】'
	};      
	var tooltip = {
	  headerFormat: '{series.name}'+'('+'{point.y}'+')'+'<br/>',
	  pointFormat: '<b>{point.x}</b>'
	};
	var plotOptions = {
	  pie: {
		 allowPointSelect: true,
		 cursor: 'pointer',
		 dataLabels: {
			enabled: true,
			format: '<b>{point.name}</b><br/><span style="color: {point.color}">資料數：{point.y}</span><br/><span style="color: {point.color}">佔比：{point.percentage:.1f} %</span>',
			style: {
			   color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			}
		 },
		 showInLegend: true
	  }
	};
	var series= [{
	  type: 'pie',
	  name: '資料',
	  data: show_data
	}];
	var json = {};
	json.credits = { enabled: false };
	json.chart = chart; 
	json.title = title;     
	json.tooltip = tooltip;  
	json.series = series;
	json.plotOptions = plotOptions;
	$('#'+div_id).highcharts(json);
}

// 啓動加載
(async () => {
	await Promise.all([loadDict1994(), loadDict1997(), loadDict1998(), loadDict2002(), loadDict2008(), loadDict1998p()]);
})()

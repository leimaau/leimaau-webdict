'use strict';

// 功能：從 url 獲取數據，數據的格式為 csv 文件，以 TAB 分隔，沒有引號
// 數據包含以下內容：[ID, 繁體, 簡體, IPA_S, IPA_T, 粵拼, 來源, 詞例, leimaau附註]
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
	, loadDict2008 = async () => loadDict('data/2008年林亦《廣西南寧白話研究》勘誤.csv', d_char2008, d_char_simp2008, d_jyutping2008, d_jyut6ping3_2008);

// 功能：將 csv 中的一行變為格式化的 HTML
function formatLine(year, line) {
	const [ID, 繁體, 簡體, IPA_S, IPA_T, 粵拼, 來源, 詞例, leimaau附註] = line.split('\t');
	return `<span>
<span>${year}</span>
<span>${ID}</span>
<span><a href="javascript:handleSubmit('${繁體}', 'char')">${繁體}</a></span>
<span><a href="javascript:handleSubmit('${簡體}', 'char_simp')">${簡體}</a></span>
<span>${IPA_S}</span>
<span>${IPA_T}</span>
<span><a href="javascript:handleSubmit('${粵拼.slice(0,-1)}', 'jyutping')">${粵拼.slice(0,-1)}</a>${粵拼.slice(-1)}</span>
<span>${來源}</span>
<span>${詞例}</span>
<span>${leimaau附註}</span>
</span>
`;
}

function dispatchSubmit(val, d1994, d1997, d1998, d2002, d2008) {
	const res = [`<span>
<span>資料</span>
<span>ID</span>
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

	const results1994 = d1994[val];
	if (results1994)
		for (const line of results1994)
			res.push(formatLine('1994', line));
	const results1997 = d1997[val];
	if (results1997)
		for (const line of results1997)
			res.push(formatLine('1997', line));
	const results1998 = d1998[val];
	if (results1998)
		for (const line of results1998)
			res.push(formatLine('1998', line));
	const results2002 = d2002[val];
	if (results2002)
		for (const line of results2002)
			res.push(formatLine('2002', line));
	const results2008 = d2008[val];
	if (results2008)
		for (const line of results2008)
			res.push(formatLine('2008', line));
	outputArea.innerHTML = res.join('\n');
}

function handleSubmit(val, queryType) {
	if (queryType == 'char')
		dispatchSubmit(val, d_char1994, d_char1997, d_char1998, d_char2002, d_char2008);
	else if (queryType == 'char_simp')
		dispatchSubmit(val, d_char_simp1994, d_char_simp1997, d_char_simp1998, d_char_simp2002, d_char_simp2008);
	else if (queryType == 'jyutping')
		dispatchSubmit(val, d_jyutping1994, d_jyutping1997, d_jyutping1998, d_jyutping2002, d_jyutping2008);
	else if (queryType == 'jyut6ping3')
		dispatchSubmit(val, d_jyut6ping3_1994, d_jyut6ping3_1997, d_jyut6ping3_1998, d_jyut6ping3_2002, d_jyut6ping3_2008);
}

// 啓動加載
(async () => {
	await Promise.all([loadDict1994(), loadDict1997(), loadDict1998(), loadDict2002(), loadDict2008()]);
})()

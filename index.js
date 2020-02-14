'use strict';

// 功能：從 url 獲取數據，數據的格式為 csv 文件，以 TAB 分隔，沒有引號，
// 數據包含以下內容：[ID, 繁體, 簡體, IPA_S, IPA_T, 粵拼, 來源, 詞例, leimaau附註]
// 作為參數的 d_char、d_jyutping 是空的 dict
// 獲取數據後，按行分開，
// 將 char 作為鍵、line 作為值存入 d_char
// 將 jyutping 作為鍵、line 作為值存入 d_jyutping
async function loadDict(url, d_char, d_jyutping) {
	const response = await fetch(url)
		, txt = await response.text()
		, lines = txt.split('\n');
	for (const line of lines) {
		if (!(line.length == 0 || line.startsWith('ID') || line.startsWith('#'))) {
			const char = line.split('\t')[1]
				, jyutping = line.split('\t')[5].slice(0,-1);
			const res_char = d_char[char]
				, res_jyutping = d_jyutping[jyutping];
			if (!res_char) { d_char[char] = [line]; } else { d_char[char].push(line); }
			if (!res_jyutping) { d_jyutping[jyutping] = [line]; } else { d_jyutping[jyutping].push(line); }
		}
	}
}

const d_char1997 = {} , d_jyutping1997 = {}
	, loadDict1997 = async () => loadDict('1997年楊煥典《南寧話音檔》（原文）勘誤.csv', d_char1997, d_jyutping1997)
	, d_char2008 = {} , d_jyutping2008 = {}
	, loadDict2008 = async () => loadDict('2008年林亦《廣西南寧白話研究》勘誤.csv', d_char2008, d_jyutping2008);

// 功能：將 csv 中的一行變為格式化的 HTML
function formatLine(year, line) {
	const [ID, 繁體, 簡體, IPA_S, IPA_T, 粵拼, 來源, 詞例, leimaau附註] = line.split('\t');
	return `<span>
<span>${year}</span>
<span>${ID}</span>
<span><a href="javascript:handleSubmit('${繁體}', 'char')">${繁體}</a></span>
<span>${簡體}</span>
<span>${IPA_S}</span>
<span>${IPA_T}</span>
<span><a href="javascript:handleSubmit('${粵拼.slice(0,-1)}', 'jyutping')">${粵拼.slice(0,-1)}</a>${粵拼.slice(-1)}</span>
<span>${來源}</span>
<span>${詞例}</span>
<span>${leimaau附註}</span>
</span>
`;
}

function dispatchSubmit(val, d1, d2) {
	const res = [`<span>
<span>資料</span>
<span>ID</span>
<span>繁體</span>
<span>簡體</span>
<span>IPA_S</span>
<span>IPA_T</span>
<span>粵拼</span>
<span>來源</span>
<span>詞例</span>
<span>leimaau附註</span>
</span>
`];
	const results1997 = d1[val];
	if (results1997)
		for (const line of results1997)
			res.push(formatLine('1997', line));
	const results2008 = d2[val];
	if (results2008)
		for (const line of results2008)
			res.push(formatLine('2008', line));
	outputArea.innerHTML = res.join('\n');
}

function handleSubmit(val, queryType) {
	if (queryType == 'char')
		dispatchSubmit(val, d_char1997, d_char2008);
	else if (queryType == 'jyutping')
		dispatchSubmit(val, d_jyutping1997, d_jyutping2008);
}

// 啓動加載
(async () => {
	await Promise.all([loadDict1997(), loadDict2008()]);
})()

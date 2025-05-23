export const formatHtml = (html: string): string => {
  const tab = '  ';
  let result = '';
  let indent = 0;

  html.split(/>[\s\r\n]*</).forEach(element => {
    if (element.match(/^\/\w/)) {
      indent--;
    }

    result += tab.repeat(indent < 0 ? 0 : indent) + '<' + element + '>\n';

    if (element.match(/^<?\w[^>]*[^\/>]$/) && !element.startsWith('input') && !element.match(/br/i)) {
      indent++;
    }
  });

  return result.substring(1, result.length - 2);
};
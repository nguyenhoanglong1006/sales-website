const fs = require('fs');

const convert = require('xml-js');

module.exports = (req, io) => {

	return new function() {

		const _this = this;

		_this.actionXML =  async(data) => {

			let action = data.action;

			let type = data.type;

			let dataXML = action == 'rebuild' ? data.data.list : data.data;

			let linkSitemap;

			let xml = `<?xml version="1.0" encoding="UTF-8"?>
						<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    						http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    					</urlset>`;

			let flagsSubmit = 0;

			let date = (new Date()).getFullYear() + '-' + ((((new Date()).getMonth() + 1) < 10) ? ('0' + ((new Date()).getMonth() + 1).toString()) : ((new Date()).getMonth() + 1).toString()) + '-' + ((new Date()).getDate() < 10 ? ( '0' + ((new Date()).getDate()).toString()) : (new Date()).getDate());
			
			switch (+type) {
				case 2:
					linkSitemap = data.data.language == 1 ? './uploads/sitemap/page/page-sitemap.xml' : './uploads/sitemap/page/page-en-sitemap.xml';
				break;

				case 4:
					linkSitemap = data.data.language == 1 ? './uploads/sitemap/post/post-sitemap.xml' : './uploads/sitemap/post/post-en-sitemap.xml';
				break;

				default:
				break;
			}

			if(action =='rebuild'){

				let sitemapXMl = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));

				sitemapXMl.urlset.url = [];

				if (type != 4) {

					for(let i = 0 ; i < dataXML.length ;i++){
						sitemapXMl.urlset.url.push({
							loc: {
								_text: dataXML[i].link
							},
							lastmod: {
								_text: date + 'T07:07:49+00:00'
							},
							priority: {
								_text: i == 0 ? '1.00' : '0.80'
							},
						});

						flagsSubmit++;
					}

				} else {
					
					for(let i = 0 ; i < dataXML.length ;i++){
						sitemapXMl.urlset.url.push({
							loc: {
								_text: dataXML[i].link
							},
							lastmod: {
								_text: date + 'T07:07:49+00:00'
							},
							changefreq: {
								_text: 'daily'
							},
							priority: {
								_text: '0.80'
							},
						});

						flagsSubmit++;
					}

				}

				fs.writeFile(linkSitemap, convert.json2xml(JSON.stringify(sitemapXMl), { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
					if (err) {
						console.log(err);
					} else {

					}
				})

				return ( flagsSubmit == dataXML.length )  ? true : false;	
			}

			if(action =='change'){

				let dataRead = await fs.promises.readFile('./uploads/sitemap.xml', "utf8");

				let sitemapXMl = JSON.parse(convert.xml2json(dataRead, { compact: true, spaces: 4 }));

				sitemapXMl.sitemapindex.sitemap = [];

				for(let i = 0 ; i < dataXML.length ;i++){

					sitemapXMl.sitemapindex.sitemap.push({
						loc: {
							_text: dataXML[i].link
						},
						lastmod: {
							_text: date + 'T07:07:49+00:00'
						},
					});

					flagsSubmit++;
				}

				fs.writeFile('./uploads/sitemap.xml', convert.json2xml(JSON.stringify(sitemapXMl), { compact: true, ignoreComment: true, spaces: 4 }), function (err, data) {
					if (err) {
						console.log(err);
					} else {

					}
				})

				return ( flagsSubmit == dataXML.length )  ? true : false;
			}
		}
	}
}
module.exports = (req, io) => {

    return new function() {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);



        _this.getlist = async () => {
           
            let table = [
                'tb_page',
                'tb_content',
                'tb_product',
                'tb_slide'
            ];
           
            let title = [    
                'Trang',
                'Tin tức',
                'Sản phẩm',
                'Sliders/ Banner'
            ];

            let icon = [
                'fas fa-window-restore',
                'fas fa-newspaper',
                'far fa-chart-bar',
                'fas fa-photo-video'
            ];

            let result = [];
                
            for (let i = 0; i < table.length; i++) { 

                let resultOn = await _module.getListOn(table[i]);

                let resultOff = await _module.getListOff(table[i]);

                result.push({icon: icon[i],title : title[i], on: resultOn.length ? resultOn[0].count : 0, off: resultOff.length ? resultOff[0].count :0 })
            }

            req.success(null, result);
        }   
    }
}
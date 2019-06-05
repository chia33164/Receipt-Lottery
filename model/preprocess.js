export class preprocessData {
    constructor() {}
    //一维OTSU图像处理算法
    OTSUAlgorithm(imgData, color){
        var m_pFstdHistogram = new Array();//表示灰度值的分布点概率
        var m_pFGrayAccu = new Array();//其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
        var m_pFGrayAve = new Array();//其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
        var m_pAverage=0;//值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
        var m_pHistogram = new Array();//灰度直方图
        var i,j;
        var temp=0,fMax=0;//定义一个临时变量和一个最大类间方差的值
        var nThresh = 0;//最优阀值
        //获取灰度图像的信息
        var imageInfo = imgData
        //初始化各项参数
        for(i=0; i<256; i++){
            m_pFstdHistogram[i] = 0;
            m_pFGrayAccu[i] = 0;
            m_pFGrayAve[i] = 0;
            m_pHistogram[i] = 0;
        }
        //获取图像信息
        var canvasData = imageInfo;
        //获取图像的像素
        var pixels = canvasData.data;
        //下面统计图像的灰度分布信息
        for(i=0; i<pixels.length; i+=4){
            //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
            var r
            if (color === 'g') {
                r = pixels[i + 1];
            } else {
                r = pixels[i];
            }
            m_pHistogram[r]++;
        }
        //下面计算每一个灰度点在图像中出现的概率
        var size = canvasData.width * canvasData.height;
        for(i=0; i<256; i++){
            m_pFstdHistogram[i] = m_pHistogram[i] / size;
        }
        //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
        for(i=0; i<256; i++){
            for(j=0; j<=i; j++){
                //计算m_pFGaryAccu[256]
                m_pFGrayAccu[i] += m_pFstdHistogram[j];
                //计算m_pFGrayAve[256]
                m_pFGrayAve[i] += j * m_pFstdHistogram[j];
            }
            //计算平均值
            m_pAverage += i * m_pFstdHistogram[i];
        }
        //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
        for (i = 0 ; i < 256 ; i++){
            temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) 
                * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) 
                / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
            if (temp > fMax)
            {
                fMax = temp;
                nThresh = i;
            }
        }
        //下面执行二值化过程 
        for(i=0; i<canvasData.width; i++){
        for(j=0; j<canvasData.height; j++){
            //取得每一点的位置
            if (color === 'g') {
                var ids = (i + j*canvasData.width)*4 + 1
                //取得像素的R分量的值
                var r = canvasData.data[ids]
                //与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
                var gray = r>nThresh? 0:255
                canvasData.data[ids-1] = gray
                canvasData.data[ids] = gray
                canvasData.data[ids+1] = gray
            } else {
                var ids = (i + j*canvasData.width)*4
                //取得像素的R分量的值
                var r = canvasData.data[ids]
                //与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
                var gray = r>nThresh ? 0:255
                canvasData.data[ids] = gray
                canvasData.data[ids+1] = gray
                canvasData.data[ids+2] = gray
            }
        }
        }
        //显示二值化图像
        var newImage = document.createElement('canvas').getContext('2d');
        newImage.putImageData(canvasData,0,0);

        return [canvasData, newImage]
    }	

    getPeekRange (histogram, minThresh, TreshRange) {
        let peekRange = []
        let begin = 0
        let end = 0
        for (let i=0; i<histogram.length; i++) {
            if (histogram[i] > minThresh && begin === 0) {
                begin = i
            } else if (histogram[i] > minThresh && begin !== 0) {
                continue
            } else if (histogram[i] < minThresh && begin !== 0) {
                end = i
                if (end - begin >= TreshRange) {
                    peekRange.push([begin - 7, end + 7])
                }
                begin = 0
                end = 0
            } else if (histogram[i] < minThresh || begin === 0) {
                continue
            } else {
                // error
            }
        }
        return peekRange
    }

    split (binaryData, ctx) {
        let ver_histogram = new Array() // 重直線水平掃過圖片，其白點分佈數量
        let hori_histogram = new Array()// 水平線重直掃過圖片，其白點分佈數量
        for (let i=0; i<300; i++) ver_histogram[i] = 0
        for (let i=0; i<200; i++) hori_histogram[i] = 0
        // col
        for (let col = 0; col < 300; col++) {
            for (let row = 0; row < 200; row++) {
                if (binaryData.data[row*4*300 + col*4] === 255) {
                    ver_histogram[col]++
                }
            }
        }
        // row
        for (let row = 0; row < 200; row++) {
            for (let col = 0; col < 300; col++) {
                if (binaryData.data[row*4*300 + col*4] === 255) {
                    hori_histogram[row]++
                }
            }
        }
        let tbRange = this.getPeekRange(hori_histogram, 2, 10) // top and bottom range
        let lrRange = this.getPeekRange(ver_histogram, 2, 5) // left and right range
        // console.log('tbRange : ', tbRange)
        // console.log('ver hist : ', hori_histogram)
        // console.log('lrRange : ', lrRange)
        // console.log('hor hist : ', ver_histogram)

        let tbRect = []
        tbRange.forEach(element => {
            let char_gap = element[1] - element[0]
            let y = element[0] - 2 > 0 ? element[0] - 2 : 0
            let height = char_gap
            let data = ctx.getImageData(0, y, binaryData.width, height)
            let canvas = document.createElement('canvas').getContext('2d')
            canvas.putImageData(data, 0, 0)
            tbRect.push([canvas, data])
        })
        
        let digit = []
        tbRect.forEach (img => {
            let lrRect = []
            lrRange.forEach(element => {
                let char_gap = element[1] - element[0]
                let x = element[0] - 2 > 0 ? element[0] - 2 : 0
                let width = char_gap
                lrRect.push(img[0].getImageData(x, 0, width, img[1].height))
            })
            digit.push(lrRect)
        })
        return digit
    }

    processImage (path) {
        return new Promise ((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext("2d")
            // const ctx2 = document.getElementById('images').getContext('2d')
            let r_count = 0
            let g_count = 0
            img.crossOrigin = ''
            img.src = path
            img.onload = () => {
                canvas.setAttribute('width', 400)
                canvas.setAttribute('height', 400)
                ctx.drawImage(img, 0, 0, 400, 400)
                const imageData = ctx.getImageData(100, 75, 300, 200)

                // turn picture to gray
                for (let i=0; i<imageData.data.length; i+=4) {
                    let r = imageData.data[i]
                    let g = imageData.data[i+1]
                    r > g ? r_count++ : g_count++
                }
                ctx.putImageData(imageData, 0, 0)
                let binaryData = r_count >= g_count ? this.OTSUAlgorithm(imageData, 'r') : this.OTSUAlgorithm(imageData, 'g')
                // console.log(binaryData)
                let digit = this.split(binaryData[0], binaryData[1])
                let x = 0
                let y = 0
                let numberImageData = []
                // console.log(digit)
                digit.forEach(element => {
                    element.forEach(num => {
                        // ctx.putImageData(num, x, y)
                        let newCanvas = document.createElement('canvas')
                        newCanvas.setAttribute('height', num.height)
                        newCanvas.setAttribute('width', num.width)
                        newCanvas.getContext('2d').putImageData(num, 0, 0)
                        ctx.drawImage(newCanvas, x, y, 28, 28)
                        let digitData = ctx.getImageData(x, y, 28, 28)
                        for (let i=0; i<digitData.data.length; i+=4) {
                            digitData.data[i] = digitData.data[i] > 0 ? 255 : 0
                            digitData.data[i+1] = digitData.data[i+1] > 0 ? 255 : 0
                            digitData.data[i+2] = digitData.data[i+2] > 0 ? 255 : 0
                        }
                        for (let i=0; i<digitData.data.length; i+=4) {
                            numberImageData.push(digitData.data[i] / 255)
                        }
                    })
                })
                let result = new Float32Array(numberImageData)
                // console.log('result : ', result)
                resolve(result)
            }
        })
    }
}
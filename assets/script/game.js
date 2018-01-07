cc.Class({
    extends: cc.Component,

    properties: 
    {
        gridHeight: 20, //棋盘大小
        mineChance: 10, //产生地雷的概率
        gameLayer:
        {
            default: null,
            type: cc.Node
        },
        gridPrefab: 
        {
            default: null,
            type: cc.Prefab
        },
        gridBPrefab: 
        {
            default: null,
            type: cc.Prefab
        }
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // 储存棋盘
        this.gridArr = new Array();
        for (let i = 0; i < this.gridHeight; i++)
        {
            this.gridArr[i] = new Array();
        }

        //储存地雷内容
        this.mineArr = new Array();
        for (let i = 0; i < this.gridHeight; i++)
        {
            this.mineArr[i] = new Array();
        }

        //储存棋盘数据
        this.mineDataArr = new Array(this.gridHeight);
        for (let i = 0; i < this.gridHeight; i++)
        {
            this.mineDataArr[i] = new Array(this.gridHeight,0);
        }

        //储存打开情况
        this.isGridOpen = new Array(this.gridHeight);
        for (let i = 0; i < this.gridHeight; i++)
        {
            this.isGridOpen[i] = new Array(this.gridHeight,0);
        }

        this.spawnMine();
        this.spawnGridBoard();
        cc.log("onLoad done");
    },

    start () {

        

    },

    spawnMine: function()
    {
        //生成地雷
        for (let i = 0; i < this.gridHeight; i++)
        {
            for (let j = 0; j < this.gridHeight; j++)
            {
                //如果随机出来的数字小于mineChance，则是雷
                let tmp = cc.random0To1() * 100;

                if (tmp < this.mineChance)
                {
                    cc.log(tmp + "    " + this.mineChance);
                    this.mineArr[i][j] = true;
                }
                else
                {
                    this.mineArr[i][j] = false;
                }
            }
        }

        //生成数据
        for (let i = 0; i < this.gridHeight; i++)
        {
            for (let j = 0; j < this.gridHeight; j++)
            {
                //判断该格子是否地雷,如果是，标记为-1，代表地雷
                if (this.mineArr[i][j])
                {
                    this.mineDataArr[i][j] = -1;
                }
                else
                {
                    let tmp = 0;
                    //判断该棋子四边是否有地雷
                    if (i > 0 && j > 0 && this.mineArr[i-1][j-1]) tmp++;
                    if (i > 0 && this.mineArr[i-1][j]) tmp++;
                    if (i > 0 && j < this.gridHeight-1 && this.mineArr[i-1][j+1]) tmp++;
                    if (j > 0 && this.mineArr[i][j-1]) tmp++;
                    if (j < this.gridHeight-1 && this.mineArr[i][j+1]) tmp++;
                    if (i < this.gridHeight-1 && j > 0 && this.mineArr[i+1][j-1]) tmp++;
                    if (i < this.gridHeight-1 && this.mineArr[i+1][j]) tmp++;
                    if (i < this.gridHeight-1 && j < this.gridHeight-1 && this.mineArr[i+1][j+1]) tmp++;

                    this.mineDataArr[i][j] = tmp;
                }
            }
        }

        //初始化打开情况
        for (let i = 0; i < this.gridHeight; i++)
        {
            for (let j = 0; j < this.gridHeight; j++)
            {
                this.isGridOpen[i][j] = false;
            }
        }
    },

    spawnGridBoard: function()
    {
        //计算起点
        let gridx = this.gridPrefab.data.getContentSize().width;
        let gridy = this.gridPrefab.data.getContentSize().height;

        let widthZero = 0 - this.gridHeight*gridx/2;
        let heightZero = 0 - this.gridHeight*gridx/2;
        
        
        //初始化棋盘信息
        for (let i = 0; i < this.gridHeight; i++)
        {
            for (let j = 0; j < this.gridHeight; j++)
            {
                
                this.gridArr[i][j] = cc.instantiate(this.gridPrefab);
                this.gridArr[i][j].getComponent('grid').x = i;
                this.gridArr[i][j].getComponent('grid').y = j;
                this.gridArr[i][j].getComponent('grid').game = this;
                this.gameLayer.addChild(this.gridArr[i][j]);
                this.gridArr[i][j].setPosition(widthZero + i * gridx, heightZero + j * gridy);
                
            }
        }
        
    },

    clickGrid: function(x, y)
    {
        this.open(x,y);
    },

    open: function(x, y)
    {
        if (x>=0 && x<this.gridHeight && y>=0 && y<this.gridHeight)
        {
            if (!this.isGridOpen[x][y])
            {
                this.isGridOpen[x][y] = true;
                this.gridArr[x][y].color = cc.Color.WHITE;
                if (this.mineDataArr[x][y] > 0)
                {
                    this.gridArr[x][y].children[0].getComponent(cc.Label).string = this.mineDataArr[x][y].toString();
                    return;
                }
                else if (this.mineDataArr[x][y] == -1)
                {
                    this.gridArr[x][y].children[0].getComponent(cc.Label).string = "*";
                    return;
                }
                this.open(x-1, y);
                this.open(x+1, y);
                this.open(x,y-1);
                this.open(x,y+1);
            }
        }
    }
    // update (dt) {},
});

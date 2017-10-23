var ShowViewer = ShowViewer || {};
var index = 0;
var indexReal = 0;
var arr = [];
var arrReal = [];
var newObj = {};
var newObjReal = {};
var currArr = [];
var currArrReal = [];
var first = true;
var firstReal = true;
var water = [];
var environment =[];
var globalviewer = null;
var pickedModels = [];
var unClickedColor = new FreeDo.Color(1,1,1,1);
var clickedColor = new FreeDo.Color(1,3,1,0.9);
window.obj = {};
ShowViewer.EbsObj = function (nodeId, fatherId, type, name, startDatePlan, endDatePlan, startDate, endDate, modelId, leaf) {
    this.nodeId = nodeId;
    this.fatherId = fatherId;
    this.type = type;
    this.name = name;
    this.startDatePlan = startDatePlan;
    this.endDatePlan = endDatePlan;
    this.startDate = startDate;
    this.endDate = endDate;
    this.modelId = modelId;
    this.leaf = leaf;
    this.children = [];
}

ShowViewer.ModelObj = function (id, parentId, name, type, url, lon, lat, height, course, alpha, roll, scaleX, scaleY, scaleZ) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.url = url;
    this.type = type;
    this.lon = lon;
    this.lat = lat;
    this.height = height;
    this.course = course;
    this.alpha = alpha;
    this.roll = roll;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.scaleZ = scaleZ;
    var modelMatrix = FreeDoTool.getModelMatrix(lon, lat, height, course, alpha, roll, scaleX, scaleY, scaleZ);
    this.primitive = ShowViewer.viewer.scene.primitives.add(FreeDo.Model.fromGltf(
        {
            id: id,
            url: url,
            show: true,                     // default
            modelMatrix: modelMatrix,
            allowPicking: false,            // not pickable
            debugShowBoundingVolume: false, // default
            debugWireframe: false
        }));
}

ShowViewer.GroupObj = function (id, parentId, name, type) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.type = type;
    this.children = [];
}

ShowViewer.init = function (earthId,baseImageryProvider) {
    this.modelContainer = this.modelContainer || {};//未来保存加载的模型的容器，便于快速访问
    this.ebsContainer = this.ebsContainer || {};
    this.timeArray = this.timeArray || [];//保存了按时间排序的Ebs叶子节点
    this.timeIndex = 0;
    this.showEbsContainer = this.showEbsContainer || {};//保存了当前时间点中显示出来的Ebs节点对应的模型
    this.viewer = this.viewer || {};
    this.viewer = new Freedo.Viewer(earthId,{
		animation : false,
		baseLayerPicker : false,
		fullscreenButton : false,
		geocoder : false,
		homeButton : false,
		infoBox :false,
		sceneModePicker : false,
		selectionIndicator : false,
		timeline : false,
		navigationHelpButton : false,
		navigationInstructionsInitiallyVisible : false,
		selectedImageryProviderViewModel : false,
		scene3DOnly : true,
		clock : null,
		showRenderLoopErrors : false,
		automaticallyTrackDataSourceClocks:false,
		imageryProvider : baseImageryProvider || this.getTiandituGloble()
	});
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.imageryLayers.addImageryProvider(new FreeDo.WebMapTileServiceImageryProvider({
		url : "http://{s}.tianditu.com/cia_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet={TileMatrixSet}&TileMatrix={TileMatrix}&TileRow={TileRow}&Tilecol={TileCol}&style={style}&format=tiles",
		style:"default",
		tileMatrixSetID:"w",
		maximumLevel:17,
		subdomains : ["t7","t6","t5","t4","t3","t2","t1","t0"]
	}));
    globalviewer = this.viewer;
    // cx 添加
    this.flag = true;
    this.selectModels = [];
    this.lastModelId = -2;
    this.cam = [116.00013, 38.998999999999999999999999, 80.75962432438108];
    new Compass(this.viewer);
    
    var e = this.viewer.entities.add({
    	name:"baiyangdianshuiwenbaohu",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees( 115.97446053803657, 38.977833390000946 ),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '白洋淀水文保护',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    },
        polygon : {
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                    116.0314446452668, 39.03927257942988,
                   116.03301313226252, 39.03113796842531,
                    116.01331650417139,38.985042149513795,
                    115.99135097462175,38.984261568352906,
                    115.9732277668171,38.98959996573841,
                    115.96080826860961, 38.99282377389269,
                    115.94422677035169, 39.00551010711269,
                    115.9342223088252, 39.00873481155701,
                    115.93294081342273, 39.00684056314875,
                    115.95896522270178, 38.983805699634146,
                    115.94401005579527, 38.96476311710298,
                    115.94359257871207, 38.95752852596502,
                    115.9471659833655, 38.95218939516595,
                    115.95732135799075, 38.9407634837488,
                    115.96147336881016, 38.92263935501272,
                    115.96281685697923, 38.89818604727685,
                    115.98671549770981, 38.89352502959028,
                    115.97224515071998, 38.87377269631841,
                    115.94114678619802, 38.852442684611376,
                    115.92159865305324, 38.846220187163226,
                    115.899587761715, 38.84754566402842,
                    115.90145879060648, 38.83267178930142,
                    115.94176780955178, 38.82791169655065,
                    115.9582293971057, 38.797740221859016,
                    115.979348793372, 38.789531788025165,
                    115.98332013103015, 38.796961232539985,
                    115.99394614677416, 38.78808606778371,
                    116.00522637385544, 38.78034791377765,
                    116.01712619722574, 38.78599958004208,
                    116.02576888701752, 38.788879718330094,
                    116.06079217767235, 38.81015506229623,
                    116.0504612788078, 38.824693485617594,
                    116.0504735507271, 38.834681336243555,
                    116.07758762230749, 38.88017116667896,
                    116.09580011901171, 38.87902453301731,
                    116.10434849074137, 38.9070193957908,
                    116.10151603292354, 38.911909825573225,
                    116.06794562501436, 38.914807621862586,
                    116.05641894983947, 38.92425644934402,
                    116.04588872248189, 38.92336693247882,
                    116.04815667466663, 38.93848863092328,
                    116.03419278797261, 38.94950001978323,
                    116.02931924216097, 38.95606423300237,
                    116.03785753205766, 38.97475706631908,
                    116.01875013969729, 38.98087845949724,
                    116.03878524441058, 39.031061601980774,
                    116.03445762857247, 39.05316967838391
                ]),
            },
            material : FreeDo.Color.BLUE.withAlpha(0.5)
        }
    });
    var e1 = this.viewer.entities.add({
    	name:"daqingheshuiwenbaohu",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees( 116.07922070266575, 39.00214319118033 ),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '大清河水文保护',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    },
        polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                    116.06108564040244, 39.01685369045914,
                   116.06058312196613, 39.013087842882186,
                   116.06096650573832, 39.01008003979864,
                    116.06548086777887, 39.00789719822306,
                   116.06998953917632, 39.00754219284402,
                    116.07684142097746, 39.00389688677509,
                   116.08115555592704, 38.99563106667927,
                    116.07846562449011, 38.991075367239894,
                   116.08175128790236, 38.98651099654549,
                    116.07973468202616, 38.97560329078361,
                   116.08063071325829, 38.97352150407416,
                    116.09434926306866, 38.972784881398795,
                    116.12137124492978, 38.975535529798684,
                    116.12087405730341, 38.97794522368023,
                    116.08343089685765, 38.97554547709951,
                    116.08524273014378, 38.98728713267871,
                    116.08278305259918, 38.990985817894696,
                   116.08445326935, 38.99596906793723,
                    116.07838321788802, 39.00480139382834,
                    116.0694803324818, 39.00922053308647,
                   116.07148032745276, 39.01145819314565,
                    116.07676309099328, 39.01382239388695,
                    116.07420323939421, 39.01719993109065,
                   116.06912580335603, 39.01782736270037,
                    116.06955667504025, 39.02069345683166,
                    116.06782845909619, 39.02116361850708,
                    116.06693609433043, 39.01769557758916,
                    116.06888320375566, 39.016073669835116,
                    116.07319775315266, 39.01546039604893,
                   116.07327884936223, 39.01442089793819,
                    116.06749016170372, 39.01049115290245,
                   116.06655567567425, 39.009749819779124,
                    116.06313556391049, 39.01093550520687,
                    116.06315429409422, 39.015558483809684,
                    116.06471385739646, 39.01899691259153,
                    116.06227073088736, 39.02058269078153,                        
                ]),
            },
            material : FreeDo.Color.BLUE.withAlpha(0.5),                
        }
    });
    water.push(e);
    water.push(e1);
    var chaiqian = this.viewer.entities.add({
    	name:"gaoxiaowangcunchaiquanqu",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees( 116.03948406636098, 39.000788710438925 ),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '高小王村拆迁区',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    },    	
        polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                    116.03316031472897, 39.0022221558556,
                   116.04164166920287, 39.002149218036884,
                    116.04304889433696, 38.99885273253185,
                    116.03996948835405, 38.99829446535259,
                    116.03858602258855, 38.999846838695646,
                    116.03278530435234, 39.00122102040003,                        
                ]),
            },
            material : FreeDo.Color.ORANGE.withAlpha(0.5),                
        }
    });

    var chaiqian1 = this.viewer.entities.add({
    	name:"zhangweizhuangtoucunchaiqianqu1",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees( 116.06858204514421, 39.00027129930735 ),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '张巍庄头村拆迁区1',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    }, 
    	polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                	116.06645349307173, 39.00128583259063,
                	116.06805890528415, 39.00137476160155,
                	116.06847203271361, 39.00096730772978,
                	116.07099855244729, 39.00068954968628,
                	116.07108370221013, 38.99965486552117,
                	116.06680094255128, 38.999430993453615,  
                	116.06634852291182, 39.001497720099685
                ]),
            },
            material : FreeDo.Color.ORANGE.withAlpha(0.5),                
        }
    });
    
    var chaiqian2 = this.viewer.entities.add({
    	name:"zhangweizhuangtoucunchaiqianqu2",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees( 116.07423862499418, 39.00019520379515 ),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '张巍庄头村拆迁区2',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    }, 
    	polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                	116.0729476400768, 39.00128672511788,
                	116.07443392797242, 39.001305921069324,
                	116.07450637409187, 39.00095121045232,
                	116.07611445700955, 39.001020225635656,
                	116.07692005313103, 38.99958268244487,
                	116.07269768778842, 38.99948404432535,  
                	116.07286882540146, 39.001300425347125
                ]),
            },
            material : FreeDo.Color.ORANGE.withAlpha(0.5),                
        }
    });
    
    var chaiqian3 = this.viewer.entities.add({
    	name:"xiaoyangcunchaiqianqu",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees(115.97102931062608, 39.00109154188958),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '小阳村村拆迁区',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    }, 
    	polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                	115.96824373928295, 39.00265612332528,
                	115.97494923880352, 39.00230653905432,
                	115.9736701324057, 38.99958885643518,
                	115.96909923334594, 38.99943285871234,
                	115.96740306407922, 39.00292926555422,
                ]),
            },
            material : FreeDo.Color.ORANGE.withAlpha(0.5),                
        }
    });
    
    var chaiqian4 = this.viewer.entities.add({
    	name:"dayangcunchaiqianqu",
    	show : false,
    	position : FreeDo.Cartesian3.fromDegrees(115.98010448982028, 39.00048211044087),
    	    point : { //点
    	        pixelSize : 5,
    	        color : FreeDo.Color.RED,
    	        outlineColor : FreeDo.Color.WHITE,
    	        outlineWidth : 2
    	   },
	    label : { //文字标签
	        text : '大阳村村拆迁区',
	        font : '14pt monospace',
	        style : FreeDo.LabelStyle.FILL_AND_OUTLINE,
	        outlineWidth : 2,
	        verticalOrigin : FreeDo.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
	        pixelOffset : new FreeDo.Cartesian2( 0, -9 )   //偏移量
	    }, 
    	polygon : {
            outline : true,
            outlineColor : FreeDo.Color.BLACK,
            hierarchy : {
                positions : FreeDo.Cartesian3.fromDegreesArray([
                	115.97916672149702, 39.0032358412733,
                	115.97462688393176, 38.99830329643379,
                	115.98415452184332, 38.997862520049175,
                	115.98121389025711, 39.00364868091295,
                ]),
            },
            material : FreeDo.Color.ORANGE.withAlpha(0.5),                
        }
    });

    
    environment.push(chaiqian);
    environment.push(chaiqian1);
    environment.push(chaiqian2);
    environment.push(chaiqian3);
    environment.push(chaiqian4);
    $.ajax({
		url:"./drillingColumnCha/getAllDrillingColumnCha2",
		dataType:"json",
		success:function(content){
				var drillingMgr = FDDrillingMgr(globalviewer);
				for(var i=0;i<content.length;i++){
					drillingMgr.add(content[i]);
					}
				drillingMgr.startlistening(function(){});
			
		}
			
	});
    ShowViewer.initModels();
}
ShowViewer.initModels = function () {
    $.ajax({
        url: "pm/selectAll",
        dataType: "JSON",
        success: function (content) {
            var node = null;
            var modelNode = null;
            var modelParentNode = null;//模型缓存中的父节点
            var container = ShowViewer.modelContainer;

            for (var i = 0; i < content.length; i++) {
                node = content[i];

                modelParentNode = container[node.parentId];
                if (modelParentNode == undefined) {
                    modelParentNode = container[node.parentId] = { children: [] };
                }

                //非叶子节点
                if (node.leaf == 0) {
                    modelNode = new ShowViewer.GroupObj(node.id, node.parentId, node.text, node.type);

                    if (container[node.id] != undefined) {
                        modelNode.children = container[node.id].children;
                    }
                } else {
                    var parameter = JSON.parse(node.attributes.parameter);
                    modelNode = new ShowViewer.ModelObj(node.id, node.parentId, node.text, node.type, "static/model/" + parameter.filePath, parameter.lon, parameter.lat, parameter.height-46, parameter.course, parameter.alpha, parameter.roll, parameter.scaleX, parameter.scaleY, parameter.scaleZ);
                }

                container[node.id] = modelNode;

                modelParentNode.children.push(modelNode.id);
               
            }
        }

    });
}
ShowViewer.fly=function(viewer,lon,lat,height,callback){
	$(".msgInfo").hide();
	var camera = viewer.camera;
	 camera.flyTo({  
	        destination : FreeDo.Cartesian3.fromDegrees( lon, lat-0.0014,height ),  
	        orientation : {  
	            heading : FreeDo.Math.toRadians( 0 ),  
	            pitch : FreeDo.Math.toRadians( -15 ),  
	            roll : FreeDo.Math.toRadians( 0 )  
	        },  
	        duration : 1,//动画持续时间
	        complete : function(){
	        	callback(viewer.canvas);
	        }
	 });
	 
}
ShowViewer.initLeftClick = function(viewer,callback) {
	var screenSpaceEventHandler = new FreeDo.ScreenSpaceEventHandler(viewer.canvas);
	screenSpaceEventHandler.setInputAction(function(movement){
		$(".msgInfo").hide();
		var picked = viewer.scene.pick(movement.position);
		if(picked==undefined){
			ShowViewer.changeColor(picked);
			callback(undefined,undefined)
		}else{
			if(picked.primitive.boundingSphere != undefined){
				ShowViewer.changeColor(picked);
			}
			callback(movement.position,picked);
		}
	}, FreeDo.ScreenSpaceEventType.LEFT_CLICK);
	

}
ShowViewer.changeColor=function(picked){
	if(picked==undefined){	//如果picked为空则表示点击无模型处，使之前点变色的模型重置颜色并清空所选模型容器
		
		for(var i=0;i<pickedModels.length;i++)
			pickedModels[i].primitive.color=unClickedColor;
		
		pickedModels=[];
		
		return ;
	}
	
	if(pickedModels.length!=0){	//使之前点变色的模型重置颜色并清空所选模型容器
	
	
		for(var i=0;i<pickedModels.length;i++)
			pickedModels[i].primitive.color=unClickedColor;
		
		pickedModels=[];
	}
			
	pickedModels.push(picked);	//缓存点选模型
	
	pickedModels[0].primitive.color=clickedColor; //变色
	
	 
}
ShowViewer.getTiandituGloble =function() {
	var tg = new Freedo.WebMapTileServiceImageryProvider({
		url : "http://{s}.tianditu.com/img_c/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet={TileMatrixSet}&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style={style}&format=tiles",
		style:"default",
		tileMatrixSetID:"c",
		tilingScheme:new Freedo.GeographicTilingScheme(),
		tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
		maximumLevel:17,
		subdomains : ["t0","t1","t2","t3","t4","t5","t6","t7"]
	});
	return tg;
}
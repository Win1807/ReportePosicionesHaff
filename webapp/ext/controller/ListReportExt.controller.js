sap.ui.controller("com.stratesys.infposcashacc.ext.controller.ListReportExt", {

	onInit: function () {
		this._cyDefault = "D4";
		this._dateDefaul = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "YYYY-MM-dd"
		});
	},
	onInitSmartFilterBarExtension: function (oEvent) {
		var smartFilterBar = this.getView().byId("listReportFilter");

		var field1 = smartFilterBar.getControlByKey("xpperiod");
		field1.setValue(this._cyDefault);
		var field2 = smartFilterBar.getControlByKey("xpdate");
		var dateFormat = this._dateDefaul;
		var datetoDay = dateFormat.format(new Date());
		field2.setValue(datetoDay);

	},
	onBeforeRebindTableExtension: function (oEvent) {

		// debugger;
		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var path2 = oSmartFilterBar.getParameterBindingPath();

		var e = this.byId("idDate").getValue();
		// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-ddTKK:mm:ss" });
		// var dateOdataVal = dateFormat.format(e);
		var r = this.byId("idPeriod").getValue();
		// var path = "ZP_INF_POSICIONES(p_dato=27%EUR27%)/Results";

		// var ls_date = encodeURIComponent(sap.ui.model.odata.ODataUtils.formatValue(1436109229000, "Edm.DateTime")).toString();

		if (r === "") {
			r = this._cyDefault;
			this.byId("idPeriod").setValue(r);
		}
		if (e === "") {
			e = this._dateDefaul;
			this.byId("idDate").setDateValue(e);
		}
		var ls_date = "" + encodeURIComponent(sap.ui.model.odata.ODataUtils.formatValue(e, "Edm.DateTime")).toString();
		// var path = oSmartTable.getModel().createKey("/ZCDS_FSCM_INFORME_DIV", {

		var oColumns = oSmartTable.getTable().getColumns();

		oColumns[0].setShowIfGrouped(false);
		oColumns[1].setShowIfGrouped(false);
		oColumns[2].setShowIfGrouped(false);
		oColumns[3].setShowIfGrouped(false);
		// 
		var date = new Date(e); // this.byId("idDate").getDateValue();
		var limit = parseInt(r.substring(1, 2)) + 7;
		var li_numcols = oColumns.length - 1;
		var ls_typeCycle = r.substring(0, 1);

		oColumns[3].setWidth("180px");
		oColumns[4].setWidth("180px");
		oColumns[5].setWidth("180px");
		// oColumns[6].getLabel().setText("Vencidas");
		// oColumns[6].setSummed(false);
		// var oRangeDates = [];
		// date.setDate(date.getDate() - 1);

	
		var li_numrange = 0; 
		switch (ls_typeCycle) {
		case 'D':
				li_numrange = 1; //Días
			break;
		case 'W':
			li_numrange = 7;//Dias
			break;
		case 'M':
			li_numrange = 1;//Mes
			break;

		case 'Q':
			li_numrange = 3;//Meses
			break;

		}
		date.setDate(date.getDate() - 1);
		var ld_begda = new Date("1900-01-01"),
		    ld_endda = date;
		 var j = 1;
		 var dateFormatPrint = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "dd.MM.YYYY"
        });
       var dateFormatCreate = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "YYYY-MM-dd"
        });
        var ls_print_period;
		for (var i = 7; i < li_numcols; i++) {
			var ld_begda1,
				ld_endda1;
				
			if (i < limit) {
				ld_begda1 = new Date(dateFormatCreate.format(ld_endda));
				ld_begda1.setDate(ld_begda1.getDate() + 1);
	
				if (ls_typeCycle === 'D'){
			    ld_endda1 = new Date(dateFormatCreate.format(ld_endda));
				ld_endda1.setDate(ld_endda1.getDate() + li_numrange);
				
				ls_print_period = dateFormatPrint.format(ld_endda1);
				}else if(ls_typeCycle === 'W'){
			    ld_endda1 = new Date(dateFormatCreate.format(ld_endda));
				ld_endda1.setDate(ld_endda1.getDate() + li_numrange);
				
				ls_print_period = dateFormatPrint.format(ld_begda1) +"~"+ dateFormatPrint.format(ld_endda1);
				}else if(ls_typeCycle==='M'||ls_typeCycle==='Q'){
					ld_endda1 = new Date(dateFormatCreate.format(ld_endda));
					ld_endda1.setMonth(ld_endda1.getMonth() + li_numrange);
					ls_print_period = dateFormatPrint.format(ld_begda1) +"~"+ dateFormatPrint.format(ld_endda1);	
				}
				
			ld_endda = new Date(dateFormatCreate.format(ld_endda1));
				// oRangeDates.push({"begda": ld_begda, "endda": ld_endda});
				
				oColumns[i].getLabel().setText(ls_print_period);
				// oColumns[i].getLabel().setText(date.toJSON().split('T')[0]);
				// date.setDate(date.getDate() + 1);
				
				
				
				oColumns[i].setWidth("180px");
				// oColumns[i].setSummed(false);
				// j++;
			} else {
				oSmartTable.getTable().getColumns()[i].setVisible(false);
			}
			oColumns[i].setAutoResizable(true);

		}
		oColumns[i].setWidth("180px");
		oColumns[i].getLabel().setText("Futuros");
		// oColumns[i].setSummed(false);

		// 	"p_period": r,
		// 	"p_date": ls_date
		// }) + "/Results";
		var path = "/ZP_INF_POSICIONES(p_keydate=" + ls_date + ",p_CyclePattern='" + r + "')/Results";
		oSmartTable.setTableBindingPath(path);

	},

	onClickActionZP_INF_POSICIONESResults1: function (oEvent) {},
	/*
	 * Content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */
	getCustomAppStateDataExtension: function (oCustomAppData) {
		/*
		var oCustomField1 = this.oView.byId("SampleFilterFieldID");
		if (oCustomField1) {
			oCustomAppData.SampleFilterFieldID = oCustomField1.getValue();
		}
		return oCustomAppData;
		*/
	},
	/*
	 * In order to restore content of the custom field in the filterbar e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */
	restoreCustomAppStateDataExtension: function (oCustomAppData) {
		/*
		if (oCustomAppData.SampleFilterFieldID !== undefined) {
			if ( this.oView.byId("SampleFilterFieldID") ) {
				this.oView.byId("SampleFilterFieldID").setSelectedKey(oCustomAppData.SampleFilterFieldID);
			}
		}
		*/
	},
	validateCyclePattern: function (oEvent) {
		var b = this.getView().byId("idPeriod");
		var s = b.getValue().toUpperCase();
		this.getView().byId("idPeriod").setValue(s);
		var l = 0;
		var r = new RegExp("^([D,W,M,Q,Y]([1-9]|([1-2][0-9])|(3[0-1])))$");
		var j = [];
		b.setValueState("None");
		if (s) {
			var k = s.split("+");
			for (var i = 0; i < k.length; i++) {
				if (r.test(k[i]) === false) {
					b.setValueState("Error");
					return;
				}
				l = l + (parseInt(k[i].substr(1, 2), 10));
			}
		}
		if (l > 31) {
			b.setValueState("Error");
		}
	}
});
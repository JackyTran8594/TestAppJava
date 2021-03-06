UserWebApp.controller('WorkDetailCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state, WorkOrder, lstMonth, WorkOrderService) {

    console.log("--------WorkDetailCtrl-----------");
    $scope.WorkOrderId = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.WOJobs = WorkOrder.data.WOJobs;
    $scope.lstMonth = lstMonth.data;
    $scope.jobObject = {};
    $scope.actionType = "";

    $scope.WOVehicle = "";
    $scope.WOCustomer = "";
    $scope.WOContact = "";

    $scope.WorkOrderData = WorkOrder.data;
    $scope.WorkOrder = WorkOrder.data;


    console.log($scope.WorkOrder);

    loadCommon();
    $scope.lstTrans = [];
    $scope.lstDepartment = [];
    $scope.lstServ = [];
    $scope.lstVisitReason = [];
    $scope.jobTypes = [];
    $scope.jobCats = [];
    $scope.lstChargeCats = [];
    $scope.lstPayer = [];
    $scope.lstShifts = [];

    function loadCommon() {
        CommonServices.getTransactionTypes().then(function (data) {
            $scope.lstTrans = data;
        });
        CommonServices.getDepartments().then(function (data) {
            $scope.lstDepartment = data;

            $scope.lstDepartmentSearch = $scope.lstDepartment.slice();
            $scope.lstDepartmentSearch.shift();
            $scope.lstDepartmentSearch.unshift({ "Id": "", "Name": $translate.instant('all') });
        });
        CommonServices.getVisitReasons().then(function (data) {
            $scope.lstVisitReason = data;
        });
        CommonServices.getServiceAdvisors().then(function (data) {
            $scope.lstServ = data;
        });

        CommonServices.getJobTypes().then(function (data) {
            $scope.jobTypes = data;
        });

        CommonServices.getJobCats().then(function (data) {
            $scope.jobCats = data;
        });
        CommonServices.getChargeCats().then(function (data) {
            $scope.lstChargeCats = data;
        });
        CommonServices.getPayers().then(function (data) {
            $scope.lstPayer = data;
        });

        CommonServices.getShifts().then(function (data) {
            $scope.lstShifts = data;

            $scope.lstShiftSearch = $scope.lstShifts.slice();
            $scope.lstShiftSearch.shift();
            $scope.lstShiftSearch.unshift({ "Id": "", "Name": $translate.instant('all') });
        });

    }


    checkWorkOrder($stateParams)

    function checkWorkOrder(item) {
        if (item.action) {
            if (item.action === "offer" || item.action === "newoffer") {
                $scope.WorkOrder.IsTimeReservation = 2;
            } else if (item.action === "booking") {
                $scope.WorkOrder.IsTimeReservation = 1;
            } else {
                $scope.WorkOrder.IsTimeReservation = 0;
            }
        }


        if (item.id === undefined) {
            $scope.jobObject = {
                SiteId: '',
                CustNo: '',
                VehiId: '',
                WarrantyInfo: '',
                VHCLink: ''
            }
            $scope.actionType = "new";
        } else {
            $scope.jobObject = {
                SiteId: WorkOrder.data.SiteId,
                CustNo: (WorkOrder.data.WOCustomer && WorkOrder.data.WOCustomer.CustNo) ? WorkOrder.data.WOCustomer.CustNo : "",
                VehiId: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.VehiId) ? WorkOrder.data.WOVehicle.VehiId : "",
                WarrantyInfo: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.WarrantyInfo) ? WorkOrder.data.WOVehicle.WarrantyInfo : "",
                VHCLink: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.VHCLink) ? WorkOrder.data.WOVehicle.VHCLink : "",
            }

            $scope.actionType = "update";
        }

    }

    function tokenObject() {
        var token = {
            DMSUserId: "",
            EmployeeData: {},
            ErrorDesc: "",
            Expired: "",
            LangId: "",
            ProfileId: "",
            SiteId: "",
            Token: "",
        }
        return token;
    }


    // $scope.isNew = angular.equals($scope.WorkOrder, {});
    $scope.isNew = $stateParams.action;
    console.log($scope.WorkOrder);

    if ($scope.isNew) {
        var EmployeeData = $("#EmployeeData").data("employee");
        $scope.WorkOrder.DeptId = EmployeeData.DeptId;
        $scope.WorkOrder.Token = tokenObject();
        $scope.WorkOrder.Token.EmployeeData = EmployeeData;
    }
    $scope.workOrderNo = WorkOrder.data.WorkOrderNo;

    if ($scope.WorkOrder.ServiceDate == "" || $scope.WorkOrder.ServiceDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.ServiceDate = "";
    } else {
        $scope.WorkOrder.ServiceDate = new Date($scope.WorkOrder.ServiceDate);
    }
    if ($scope.WorkOrder.CheckOutDate == "" || $scope.WorkOrder.CheckOutDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.CheckOutDate = "";
    } else {
        $scope.WorkOrder.CheckOutDate = new Date($scope.WorkOrder.CheckOutDate);
    }
    if ($scope.WorkOrder.CheckInDate == "" || $scope.WorkOrder.CheckInDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.CheckInDate = "";
    } else {
        $scope.WorkOrder.CheckInDate = new Date($scope.WorkOrder.CheckInDate);
    }

    if ($scope.WorkOrder.ExecutionDate == "" || $scope.WorkOrder.ExecutionDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.ExecutionDate = "";
    } else {
        $scope.WorkOrder.ExecutionDate = new Date($scope.WorkOrder.ExecutionDate);
    }

    if ($scope.WorkOrder.BookMOTDate == "" || $scope.WorkOrder.BookMOTDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.BookMOTDate = "";
    } else {
        $scope.WorkOrder.BookMOTDate = new Date($scope.WorkOrder.BookMOTDate);
    }

    // $scope.$watch('WorkOrder.Mileage',function(){
    //   console.log($scope.WorkOrder.Mileage);
    //   $scope.WorkOrder.Mileage = $filter('number')($scope.WorkOrder.Mileage);
    //   console.log($scope.WorkOrder.Mileage);
    // });


    var lstab = JSON.parse(localStorage.getItem('info_tab'));
    $scope.tabs = lstab;

    $scope.tabActive = $stateParams.tab;


    console.log($stateParams);

    loadTab($stateParams.id);

    // load job tab with workorderId
    function loadTab(id) {
        if (id == null) {
            return $scope.tabActive = "header";
        }

        if ($stateParams.tab) {
            $scope.tabActive = $stateParams.tab;
        } else {
            return $scope.tabActive = "job";
        }
    }


    $rootScope.WorkOrderOrg = {};
    $scope.changeTab = function (tabActive, abc) {

        // console.log($rootScope.WorkOrderOrg);
        // console.log($scope.WorkOrder);

        // console.log(JSON.stringify($rootScope.WorkOrderOrg));
        // console.log(JSON.stringify($scope.WorkOrder));
        // console.log("angular.equals($scope.WorkOrderOrg, $scope.WorkOrder: " + angular.equals($rootScope.WorkOrderOrg, $scope.WorkOrder));
        if (angular.equals($rootScope.WorkOrderOrg, $scope.WorkOrder)) {
            console.log("Khong thay doi");
        } else {
            // console.log("--------thay doi");
            // alert("DDax thay doi ---> return");
            openConfirmSaveTab($scope.tabActive);
        }
        $scope.tabActive = tabActive;

        var params = {
            locale: $stateParams.locale,
            type: $stateParams.type,
            id: $stateParams.id,
            tab: $scope.tabActive
        };

        console.log(params);

        $state.transitionTo($state.current, params, {
            reload: false, inherit: false, notify: false, location: "replace"
        });

        // $state.go('app.main.workdetail', {
        //     'locale': $rootScope.lang,
        //     'id': $scope.WorkOrder.WorkOrderId,
        //     'type': $stateParams.type,
        //     'tab': scope.tabActive
        // }, {reload: false});

        // $state.go('app.main.workdetail', {parm1: 1}, {notify: false});
    }




    //Modal
    var $ctrl = this;
    $ctrl.animationsEnabled = true;

    $ctrl.openSearchVehicle = function (size, item) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/vehicle-form.html',
            controller: 'VehicleModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',

        });

        modalInstance.result.then(function (selectedItem) {
            // $scope.WOVehicle = selectedItem;
            $scope.jobObject.VehiId = selectedItem.VehiId
            $scope.jobObject.WarrantyInfo = selectedItem.WarrantyInfo

            if (selectedItem.PayerCustomer != null) {
                $rootScope.$broadcast("choosePayerCustomer", { "item": selectedItem.PayerCustomer });
                $scope.jobObject.CustNo = selectedItem.PayerCustomer.CustNo;
            }

            if (selectedItem.UserCustomer != null) {
                $rootScope.$broadcast("chooseUserCustomer", { "item": selectedItem.UserCustomer });
                // $scope.jobObject.CustNo = selectedItem.PayerCustomer.CustNo;
            }
            console.log($scope.jobObject.VehiId);
            $rootScope.$broadcast("chooseVehicle", { "item": selectedItem });

        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $ctrl.openSearchCustomer = function (size, item) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/customer-form.html',
            controller: 'CustomerModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.WOCustomer = selectedItem;
            $scope.jobObject.CustNo = selectedItem.CustNo

            $rootScope.$broadcast("chooseCustomer", { "item": selectedItem });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $ctrl.openSearchContact = function (size, item) {
        console.log("------contact-----");
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/customer-form.html',
            controller: 'ContactModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',
            resolve: {
                item: function () {
                    return $scope.jobObject
                }
            }

        });

        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);

            $scope.WOContact = selectedItem;
            $rootScope.$broadcast("chooseContact", { "item": selectedItem });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    var openConfirmSaveTab = function (item) {
        console.log("------contact-----");
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/confirm-form.html',
            controller: 'ConfirmSaveTabCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop: 'static',

        });

        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
            if (selectedItem) {
                $scope.saveForm(item);
            }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    //Submit tren header
    $scope.saveForm = function (type) {
        console.log("-----saveForm: " + type);
        if (type == "header") {
            $rootScope.$broadcast("saveHeader", { "item": {} });
        } else if (type == "job") {
            $rootScope.$broadcast("saveJob", { "item": {} });
        } else if (type == "planning") {
            $rootScope.$broadcast("savePlanning", { "item": {} });
        } else if (type == "checkin") {
            $rootScope.$broadcast("saveCheckin", { "item": {} });
        }
    }


    $scope.afterRender = function () {
        console.log("afterRender");
        $rootScope.WorkOrderOrg = angular.copy($scope.WorkOrder);
    }

});

UserWebApp.controller('ConfirmSaveTabCtrl', function ($scope, $uibModalInstance) {

    var $ctrl = this;
    // console.log(data);

    $ctrl.save = function () {
        $uibModalInstance.close(true);
    }

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

})
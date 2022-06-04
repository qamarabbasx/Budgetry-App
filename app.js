
//Budget Controller
var budgetController=(function(){
    //constructor
    var Expence=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
        this.percentage=-1;
    };

    Expence.prototype.calcPercentage=function(totalIncome){
        if(totalIncome > 0){
            console.log('working');
            this.percentage= Math.round( ( this.value / totalIncome)*100);
            console.log(this.percentage);

            }
            else{
                console.log('not working');
                this.percentage=-1;
            }
    };

    Expence.prototype.getPercentage=function(){
        return this.percentage;
    };

    //constructor
    var Income=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
    };

    
    //private method
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum +=cur.value;
        });
        data.totals[type]=sum;
    };
    //private data structure
    var data={
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp :0,
            inc : 0
        },
        budget : 0,
        percentage :-1
    };
    // return contains everything which we are exposing to public i.e., public functions/methods
    return {
        //public method to add item to data structure
        addItem : function(type, des,val){
            var newItem, ID;
            //create new id i.e., last item id +1 
            // to check last item we did it by .length-1.id
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length-1].id+1;}
            else{
                ID=0;
            }
            //create new item based on type 
            if(type === 'exp'){
                newItem = new Expence(ID,des,val);
                
            }else if(type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            //push new item to data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        deleteItem : function(type,id){
            //if id 6 to be removed
            //data.allitems[type][id]
            //ids=[1 2 4 6 8]
            //index =3
            var ids,index;
            //map array returns array with current(id index and complete array)
            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            index=ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1); //removing 1 index 
            }
        },

        calculateBudget:function(){
            //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget income-expense
            data.budget=data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
        },

        calculatePercentages:function(){
            // a=20
            // b=30
            // c=40
            // income=100
            // percentageA=a/income*100= 20%
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages:function(){
            var allPercentages=data.allItems.exp.map(function(cur){ //map function always returns
                return cur.getPercentage();
            });
            return allPercentages;
        },
        
        getBudget:function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        //this is for testing purpose only
        testing : function(){
           console.log(data);
        }
    };
})();
//UI Controller
var UIController=(function(){
    //private object
    var DOMstrings={
        inputType:'.add__type',
        inputDesc:'.add__description',
        inputValue:'.add__value',
        inputButton:'.add__btn',
        incomeContainer:'.income__list',
        expencesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetIncomePercentage:'.budget__income--percentage',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage:'.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        monthLabel: '.budget__title--month'
    };
    //private function because we dont have touse this outside this controller
    var formatNumber = function(num,type){
        var numSplit,int,dec;
        //3000.5567 //30000
        num=Math.abs(num); //math.absolute is used to remove any sign from the number;
        num=num.toFixed(2); //this returns string and used to add decimals on the number. //3000.56
        numSplit=num.split('.'); //is used to split string based on argument passed and RETURNS array //[3000,56]
        int=numSplit[0]; //contains number part //3000
        dec=numSplit[1]; //contains decimal part //56

        if(int.length > 3 && int.length<6){
            //1,000
            //10,000
            int=int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3); //substr is short for substring
            //substr(index,howManyChractersWeRead),(0,1), index where we start(0) , and number for chracters we read(1).
        }
        else if(int.length > 5){
            //1,00,000
            //10,00,000
            int=int.substr(0,int.length-5) + ',' + int.substr(int.length-5,2)+ ',' + int.substr(int.length-4,3);
        }
        return (type === 'exp'?'-':'+') + ' ' + int + '.' + dec;
    };
    var nodeListForEach = function(list,callBack){
        for(var i=0; i<list.length; i++){
            callBack(list[i],i);
        }
    };
    return {
        getinput : function(){ 
            return{

                 type : document.querySelector(DOMstrings.inputType).value, //value is inc or exp
                 desc : document.querySelector(DOMstrings.inputDesc).value,
                 value : parseFloat( document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem : function(obj,type) {
            var html, newHtml,element;
            // create htmlstrings with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expencesContainer;

                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placeholder text with some actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.desc);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

            //Insert the html into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        deleteListItem : function(selectorId){
            var el=document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent= formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.budgetIncomeValue).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.budgetExpensesValue).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent=obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent='---';

            }
        },
        displayPercentages: function(percentages){
            //
            var feilds = document.querySelectorAll(DOMstrings.itemPercentage);
            nodeListForEach(feilds,function(current,index){
                if(percentages[index] > 0){
                    current.textContent=percentages[index] + '%';
                }
                else{
                    current.textContent='---';
    
                }
            });

        },
        changedType:function(){
            var feilds=document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDesc + ',' +
                DOMstrings.inputValue);
            nodeListForEach(feilds,function(current){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        displayMonth:function(){
            var now,months,month,year;
            now=new Date();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(DOMstrings.monthLabel).textContent=months[month] + ' ' + year;
        },
        //this is the method to clear all input feilds to empty when we hit enter or click on button
        clearFeilds:function(){
            var feilds,feildsArr;
            //query all property is uset to select  multiple strings and it returns list
            feilds=document.querySelectorAll(DOMstrings.inputDesc + ',' + DOMstrings.inputValue);
            // here we are tricking arrays and let array assume feilds is an array
            feildsArr=Array.prototype.slice.call(feilds);
            //now we have to clear data for each element in feilds array
            feildsArr.forEach(function(current,index,array){
                current.value=" " ;
            });
            // after clearing input feilds where we want our focus i.e., cursor
            feildsArr[0].focus();
        },
        //exposing private strings to public under this method
        getDOMStrings : function(){
            return DOMstrings;
        }
    };

})();

//Global App Controller with previous controllers as parameters
var controller=(function(bdgtCtr,UICtr){
    var setupEventListeners=function(){
        var DOM = UICtr.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click',ctrAddButton);
        document.addEventListener('keypress',function(event) { 
        //console.log('event') to log the button pressed and also to check the  codes of key etc.
        if(event.key === 'Enter' || event.code === 'Enter'){ 
        ctrAddButton();
        }
    });
    document.querySelector(DOM.container).addEventListener('click',ctrDeleteButton);
    document.querySelector(DOM.inputType).addEventListener('change',UICtr.changedType)
    };
    var updateBudget=function(){
        //calculate budget
        bdgtCtr.calculateBudget();

        //return the budget
        var budget=bdgtCtr.getBudget();

        //Display Budget on UI
        UICtr.displayBudget(budget);
    };
    var updatePercentages=function(){
        //Calculat percentages
        bdgtCtr.calculatePercentages();

        // Read percentages from the budget controller
        var itemPercentages=bdgtCtr.getPercentages();

        //update the UI with the new percentages
        UICtr.displayPercentages(itemPercentages);
        console.log(itemPercentages);
    };
    var ctrAddButton=function(){
        var input, newItem;
        //get input values from input field
        input=UICtr.getinput();

        if(input.desc !== "" && !isNaN(input.value) && input.value>0){
            // add the item to budget controller
            newItem=bdgtCtr.addItem(input.type,input.desc,input.value);

            //add the item to UI
            UICtr.addListItem(newItem,input.type);

            //clear input feilds
            UICtr.clearFeilds();

            //calculate & update budget
            updateBudget(); 

            //calculate and update percentages
            updatePercentages();
        }
        
       
        
    };
    var ctrDeleteButton=function(event){
        var itemID,splitID,type,ID;
        // event delegation, buble up to main container.
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){// if we have item then it will return true and inner code will execute
            //split is used to split strings based on some string
            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);// split returns string so we convert string to integer  

            //delete item from data
            bdgtCtr.deleteItem(type,ID);

            //delete item from UI
            UIController.deleteListItem(itemID); //passing this function complete id i.e., income-0

            //update budget
            updateBudget();

            //calculate and update percentages
            updatePercentages();
        }


    };
    return{
        //starting point of the application so that we can normalize application to starting point.
        init : function(){
            console.log('Application has started.')
            UICtr.displayMonth();
            setupEventListeners();
            //we are usin the object itself instead of object variable and we are using the same object created in budget controler and setting their initial values =0
            UICtr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };
    

})(budgetController,UIController);
//globally calling the init function
controller.init();
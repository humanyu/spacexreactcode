import React, { Component} from 'react';
import './App.css';
const queryString = require('query-string');


  class App extends Component {
  constructor(props) {
    super();
   
    this.state = { apiResponse: [],isLoading: true,year:'',launch:'',land:'' };
  

    }
    async componentDidMount(): Promise<void> {
    //alert(this.props.match.params.launch_year)
    const parsed = queryString.parse(window.location.search);
    if(parsed.launch_year!=undefined){
      await this.setState({'year':parsed.launch_year }, this.updateState);
    }
    if(parsed.launch_success!=undefined){
      await this.setState({'launch':parsed.launch_success }, this.updateState);
    }
    if(parsed.land_success!=undefined){
      await this.setState({'land':parsed.land_success }, this.updateState);
    }
 
    this.callAPI();


}

callYear() {
  var YearListArray=[]

    for (let i = 2006; i <= new Date().getFullYear(); i++) {
      YearListArray.push(<div key={i} className={"col-md-5 text-center year  "+ (this.state.year == i ? 'active_h' : 'inactive_h')} onClick={e => this.applyClick(e,'year',i)}  >{i}</div>);
    }
    return YearListArray;
  
}

//applyClick(e,ty,vl) {
  applyClick= async(e,ty,vl)=>{
 
var sections = document.querySelectorAll('.'+ty);
    for (let i = 0; i < sections.length; i++){
        sections[i].classList.remove('active_h');
    }
e.target.classList.add('active_h');
var q;
if(ty=='year'){
  await this.setState({'year':vl }, this.updateState);
   q= this.updateQueryStringParameter(window.location.href,'launch_year',vl);
  window.history.pushState({path:q},'',q);
} else if(ty=='launch'){
  await this.setState({'launch':vl }, this.updateState);
   q= this.updateQueryStringParameter(window.location.href,'launch_success',vl);
  window.history.pushState({path:q},'',q);
} else if(ty=='land') {
  await this.setState({'land':vl }, this.updateState);
   q= this.updateQueryStringParameter(window.location.href,'land_success',vl);
  window.history.pushState({path:q},'',q);
}

this.callAPI();



}
updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}
updateState = () => {
  
}


callAPI() {

	this.setState({ isLoading: true,apiResponse: [] });
var filter='';
  
if(this.state.year!=''){
filter += "&launch_year="+this.state.year
}
if(this.state.launch!=''){
  filter += "&launch_success="+this.state.launch
  }
  if(this.state.land!=''){
    filter += "&land_success="+this.state.land
    }
//alert(filter);


    fetch("https://api.spaceXdata.com/v3/launches?limit=100"+filter)
	.then((response) => response.json())
      .then((responseJson) => {
      
      // console.log(JSON.stringify(responseJson));
        if(responseJson!=''){
		
         //alert(JSON.stringify(responseJson.data));
 this.setState({ apiResponse: responseJson,isLoading:false })
 
	
       
      } else {
  this.setState({ isLoading:false })
      
      }


      })
      .catch((error) =>{
   
      });
	
	
	
    
}



render(){

 

    return (
    <>
     
       
     <div className="container" style={{backgroundColor:'#f8f8f8'}} >
   <h4 style={{fontWeight:'bold'}}>SpaceX Launch Program</h4>

   <div className="col-md-12">
   <div className="col-md-3 hidden-sm">
   <p><b>Filters</b></p>
   <p className="text-center" style={{borderBottom:'1px solid black'}}>Launch years</p>

   <div className="col-md-12 " style={{marginBottom: '30px',cursor:'pointer'}} >
  {this.callYear()}
   
 
   </div>


   
   <p className="text-center" style={{borderBottom:'1px solid black'}}>Successful Launch</p>

   <div className="col-md-12 " style={{marginBottom: '30px',cursor:'pointer'}}>
   
   <div className={"col-md-5 text-center launch "+ (this.state.launch == 'true' ? 'active_h' : 'inactive_h')}  onClick={e => this.applyClick(e,'launch','true')}    >True</div>
   <div className={"col-md-5 text-center launch "+ (this.state.launch == 'false' ? 'active_h' : 'inactive_h')}  onClick={e => this.applyClick(e,'launch','false')}    >False</div>
   
   
   </div>

   <p className="text-center" style={{borderBottom:'1px solid black'}}>Successful Landing</p>

   <div className="col-md-12 " style={{marginBottom: '30px',cursor:'pointer'}}>

   <div className={"col-md-5 text-center land "+ (this.state.land == 'true' ? 'active_h' : 'inactive_h')} onClick={e => this.applyClick(e,'land','true')}  >True</div>
   <div className={"col-md-5 text-center land "+ (this.state.land == 'false' ? 'active_h' : 'inactive_h')} onClick={e => this.applyClick(e,'land','false')}  >False</div>

   
   </div>
   </div>
   <div className="col-md-9">
     { this.state.isLoading &&
   <div id="load_page_loader" >Loading...</div>
     }
<div className="col-md-12" >
{this.state.apiResponse=='' && this.state.isLoading == false &&
<h3>No data found!!</h3>

    }
{this.state.apiResponse!='' && this.state.isLoading == false &&
 this.state.apiResponse.map((data, index) => (
<div key={index} className="col-md-3" style={{paddingBottom:'10px',border:'5px solid white',height:'350px'}}>
<div className="text-center">
  
<img alt='SpaceX' src={data.links.mission_patch_small} width={180} height={180} ></img>
</div>
<p style={{fontSize:'12px',paddingTop:'10px'}}><b>{data.mission_name} #{data.flight_number}</b></p>
<p style={{fontSize:'12px',paddingTop:'10px'}}><b>Mission Ids:</b> { data.mission_id!='' && data.mission_id.toString()  }</p>
<p style={{fontSize:'12px'}}><b>Launch year:</b>{data.launch_year} </p>
<p style={{fontSize:'12px'}}><b>Successful Launch:</b>{data.launch_success==1 ? 'True' : 'False'}</p>
</div>
 ))
  

}


</div>

   </div>
   </div>
   </div>



          
    </>
  );

}

}
export default App;
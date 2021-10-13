import Model from "./Model";

class Custom extends Model  {
  constructor() {
    super("Custom",
      [["S", 0.97, "#1F85DE"], ["I", 0.03, "#de1f50"]],
      [["S", "I", 0.5]],
      20, 0.05);
    this.state = {input: ""};
  }

  textFieldChanged = (e) => {
    let input = e.target.value;
    this.setState({input: input});
    let parsedInput = this.parseInput(e.target.value);
    //check if the input is correct, if yes then update
    if (parsedInput == null) {
      return;
    }
    this.rules = parsedInput.rules;
    this.states = parsedInput.states;
  }

  parseInput(input) {
    //regex for filtering valid rules (this is longer than it is complicated)
    let re = /[[(]"?[\w\d]+"?,"?[\w\d]+"?,([0-9]*[.])?[0-9]+[)\]][\s\t]*|[([][([]("?[\w\d]+"?,)+"?[\w\d]+"?[\])],[([]("?[\w\d]+"?,)+"?[\w\d]+"?[\])],([0-9]*[.])?[0-9]+[\])][\s\t]*/g;
    //strip spaces, tabs and newlines
    input = input.replaceAll(" ", "");
    input = input.replaceAll("\t", "");
    input = input.replaceAll("\n", "");

    let cleaned = input.match(re);
    if(cleaned == null) {
      return null;
    }

    let newRules = [];
    //regex to match states
    cleaned.forEach((element) => {
      element = element.split(",");
      //test if we have a simple or complex rule
      if (element.length === 3) {
        newRules.push(this.parseValidRule(element));
      } else {
        //check if there are an equal number of states left and right
        if (element.length % 2 === 0) {
          return;
        }
        //check if there is a split in the middle if not left != right
        if (!element[((element.length - 1) / 2)].includes("(")) {
          return;
        }
        //this rule is correct, we can continue
        newRules.push(this.parseValidRule(element));
      }
    });
    if (newRules.length === 0) {
      return null;
    }

    //parse states
    let newStates = [];
    
    //only add states that are not duplicates
    for (var i = 0; i < newRules.length; i++) {
      for (var j = 0; j < newRules[i].length - 1; j++) {
        let currentState = newRules[i][j];
        if (!newStates.includes(currentState)) {
          newStates.push(currentState);
        }
      }
    }

    //convert states to states with distribution and color
    newStates = newStates.map((x) => [x, 1/newStates.length, "#ffffff"]);

  
    return {rules: newRules, states: newStates};
  }

  parseValidRule(rule) {
    //filter states
    let subString = rule.slice(0, rule.length - 1);

    //match states
    let re = /[\w\d]+/g;
    subString = subString.map((x) => x.match(re)[0]);
    //match probability
    re = /([0-9]*[.])?[0-9]+/g
    let probability = rule[rule.length - 1].match(re);
    return [...subString, Number(probability)];
  }

  //override render
  render() {
    return(<div>
      <h3>Enter the rules like: <code>("S","I",0.1), (("I","I"),("S","I"),0.3)</code></h3>
      <textarea className="CustomInput CustomModel" type="text" onChange={this.textFieldChanged}
      value={this.state.input} required pattern="[[(]'?[\w\d]+'?,'?[\w\d]+'?,([0-9]*[.])?[0-9]+[)\]][\s\t]*|[([][([]('?[\w\d]+'?,)+'?[\w\d]+'?[\])],[([]('?[\w\d]+'?,)+'?[\w\d]+'?[\])],([0-9]*[.])?[0-9]+[\])][\s\t]*"
      placeholder='("S","I",0.1), (("I","I"),("S","I"),0.3)'/>
      {this.buildSlidersDistribution()}
      </div>);
  }
}

export default Custom;
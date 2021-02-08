import React, { useState } from "react";
import { mount, configure, shallow } from "enzyme";
import App from "./getStatement";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
// let wrapper;

// beforeEach(() => {
//   wrapper = shallow(<App />);
// });

// it("should render the value of color", () => {
//   wrapper.find("button").props("disabled");
//   wrapper.find("button").simulate("click"); // Simulating a click event.

//   //   expect(wrapper.state("color")).toEqual("transparent");
// });

describe("<TestComponent />", () => {
  let wrapper;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  beforeEach(() => {
    wrapper = Enzyme.shallow(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Count Up", () => {
    it("should render one <form>", () => {
      expect(wrapper.find("button")).toHaveLength(1);
    });
    it("should render one <button> to Add when operator '+' is passed in props", () => {
      wrapper.setProps({ NRICValid: true });
      expect(wrapper.find("button")).toHaveLength(1);
      expect(wrapper.find(".inputField").props().value).toEqual("");
    });
  });
});

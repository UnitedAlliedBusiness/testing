import React from "react";
import { mount, configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Counter from "./getStatement";
configure({ adapter: new Adapter() });

// Note: Swap `mount` for `shallow` to see that `shallow`
// doesn't respect the button's `disabled prop
describe("button works when not disabled", () => {
  //   const wrapper = mount(<Counter />);

  const wrapper = shallow(<Counter />);
  expect(wrapper.find("button")).toBeTruthy();
  //   wrapper.find("#submitBtn").simulate("click");
  test("Company and technology given", () => {
    wrapper.setProps({ NRICValid: true });
    expect(wrapper.find("button").props().disabled).toBe(true);
  });
});

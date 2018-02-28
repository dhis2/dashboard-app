import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

console.log('configure the adapter now****************');

Enzyme.configure({ adapter: new Adapter() });

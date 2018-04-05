import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Enzyme from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TriggerView from './Components/TriggerView';
import PlayControlView from './Components/Toolbar/PlayControlView';

Enzyme.configure({ adapter: new Adapter() });

describe('<TriggerView />', () => {
  const tempProps = {
    isTriggered: true,
    id: 0,
    handleTriggerClick: jest.fn(),
    isSlicee: true
  };

  const wrapper = shallow(<TriggerView {...tempProps} />);

  it('has slicee class if trigger is a slicee', () => {
    expect(wrapper.find('.slicee').length).toBe(1);
  });
});

describe('<PlayControlView />', () => {
  const testProps = {
    isPlaying: true,
    handlePlayBackModeClick: jest.fn(),
    handleStopButtonClick: jest.fn(),
    handlePlayButtonClick: jest.fn(),
    playBackMode: 'song'
  };

  const wrapper = shallow(<PlayControlView {...testProps} />);

  it('renders only one play button', () => {
    expect(wrapper.find('.play-control__play-pause-button').length).toBe(1);
  });

  it('renders only one stop button', () => {
    expect(wrapper.find('.play-control__stop-button').length).toBe(1);
  });

  it('renders correctly in song mode', () => {
    expect(wrapper.find('.play-control__play-mode-selected').length).toBe(1);

    expect(wrapper.find('.play-control__play-mode-selected').length).toBe(1);
  });

  it('pause icon is offset correctly', () => {
    let imgElWrapper = wrapper.find('.play-control__play-icon');

    expect(imgElWrapper.length).toBe(1);

    // expect(imgElWrapper.prop('style'))
    const imgElInlineStyleObj = imgElWrapper.prop('style');
    console.log(imgElInlineStyleObj.marginLeft);
    expect(imgElInlineStyleObj.marginLeft).toBe('-2px');
  });
});

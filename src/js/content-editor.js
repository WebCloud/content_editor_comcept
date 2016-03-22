import React, { Component, PropTypes } from 'react';
import { Parser } from './parser';
import { autobind } from 'core-decorators';

export default class ContentEditor extends Component {
  static propTypes = {
    template: PropTypes.string,
    componentsStyle: PropTypes.string,
    store: PropTypes.object,
    onSave: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { isPreviewing: false };
  }

  @autobind
  togglePreview() {
    const isPreviewing = !this.state.isPreviewing;
    this.setState({ isPreviewing });
  }

  @autobind
  compileTemplate() {
    const { template } = this.props;
    this.props.onSave(Parser.compileTemplate({ template }));
  }

  @autobind
  saveData() {
    const pluginDataMap = Parser.getPluginData();
    this.props.store.save(pluginDataMap)
      .then(({ pluginId, path: value }) => Parser.updatePluginData({ pluginId, value }));
  }

  render() {
    const { template: rawTemplate, componentsStyle: style } = this.props;
    const { isPreviewing } = this.state;

    const template = rawTemplate.replace(/\n|(\s{1,}(?=<))/g, '');

    const editorElements = Parser.getChildrenNodes({
      template,
      style,
      isPreviewing
    });

    const className = `editor-wrapper${isPreviewing ? ' editor-wrapper--preview' : ''}`;

    return (
      <div className={className}>
        <div className="control-bar">
          <button onClick={ this.togglePreview }>Toggle Preview</button>
          <button onClick={ this.saveData }>Save Data</button>
          <button onClick={ this.compileTemplate }>Preview result</button>
        </div>
        { editorElements }
      </div>
    );
  }
}

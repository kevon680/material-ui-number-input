import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import { StrategySelectField, Strategy,allow } from './StrategySelectField';
import bind from 'bind-decorator';
//import { NumberInput } from 'material-ui-number-input';

function reactiveProps(props: Object): string {
    let dynamicProps: string = '';
    let value: any;
    for(let prop in props) {
        if(props.hasOwnProperty(prop)) {
            value = (props as any)[prop];
            dynamicProps += `                ${prop}=${value[0] !== '"' ? `{${value}}` : value + '"'}\n`;
        }
    }
    return dynamicProps;
}

function code(language: string, props: any): string {
const types: boolean = language === typescript;
return `import * as React from 'react';
${
types ?
`
interface DemoState {
    value?: string;
    errorText?: string;
}
` : ''
}
class Demo extends React.Component${types ? '<void, DemoState>' : ''} {
    public constructor(props${types ? ': void' : ''}) {
        super(props);
    }

    public render()${types ? ': JSX.Element' : ''} {
        return (
            <NumberInput
${reactiveProps(props)}            />
        );
    }
}`;
}

interface ReactiveExampleState {
    language?: string;
    strategy?: Strategy;
    props?: any;
}

export default class ReactiveExample extends React.Component<void, ReactiveExampleState> {
    @bind
    private onLangaugeChange(language: string): void {
        this.setState({ language: language });
    }

    @bind
    private onStrategyChange(strategy: Strategy): void {
        const { props } = this.state;
        props.strategy = '"' + strategy;
        this.setState({ strategy: strategy, props: props });
    }

    public constructor(props: void) {
        super(props);
        this.state = {
            language: javascript,
            strategy: allow,
            props: {
                min: 0,
                max: 30,
                value: 'value',
                strategy: '"' + allow
            }
        };
    }

    public render(): JSX.Element {
        const { language, strategy, props } = this.state;
        return (
            <div>
                <div>
                    <StrategySelectField strategy={strategy!} onStrategyChange={this.onStrategyChange} />
                </div>
                <SourceCode
                    language={language!}
                    code={code(language!, props!)}
                    onLanguageChange={this.onLangaugeChange} />
            </div>
        );
    }
}
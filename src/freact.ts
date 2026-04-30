let root: HTMLElement | undefined = undefined;
let MyApp: (() => string) | undefined = undefined;
const hooks: unknown[] = [];
let hookIndex: number = 0;

function rerender() {
    hookIndex = 0;
    if (root) {
        const newBody = MyApp()
        if (newBody) {
            root.innerHTML = newBody;
        } else {
            throw new Error("App return a string");
        }
    } else {
        throw new Error("No root found");
    }
}

function render(root: HTMLElement, componentFunction: () => string) {
    root.innerHTML = componentFunction();
}

function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    const currentHook: T | undefined = hooks[hookIndex] as T | undefined;
    const currentHookTarget = hookIndex;

    let value;
    if (currentHook === undefined) {
        value = initialValue;
    } else {
        value = currentHook;
    }
    hookIndex++;

    function setter(newValue: T): void {
        hooks[currentHookTarget] = newValue;
        rerender();
        console.log(`Updated state ${currentHookTarget}: ${newValue}`)
    }

    return [value, setter];
}

MyApp = () => {
    const [counter, setCounter] = useState<number>(0);
    // const [secondCounter, setSecondCounter] = useState<number>(3);
    // const [message, setMessage] = useState<string>("");

    (window as any).increase = () => {
        setCounter(counter + 1);
    }

    return (`
        <button onClick="increase()">Increase the number</button>
        <strong>
            ${counter}
        </strong>
    `);
}

root = document.getElementById("root");
if (root) {
    render(root, MyApp);
}
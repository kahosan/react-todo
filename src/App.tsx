import { Global, keyframes } from '@emotion/react';
import { atom, useAtom } from 'jotai';
import { useCallback, useState } from 'react';

interface TodoProps {
  id: number
  text: string
  completed: boolean
}

const baseAtom = atom<TodoProps[]>(
  JSON.parse(localStorage.getItem('todoList') ?? '[]') as TodoProps[] || []
);
const todoAtom = atom(
  get => get(baseAtom),
  (_get, set, todoList: TodoProps[]) => {
    set(baseAtom, todoList);
    Promise.resolve().then(() => localStorage.setItem('todoList', JSON.stringify(todoList)));
  });

const LogoSpin = keyframes({
  from: {
    transform: 'rotate(0deg)'
  },
  to: {
    transform: 'rotate(360deg)'
  }
});

function Header() {
  return (
    <>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        alt='react logo'
        height='150'
        width='150'
        css={{ animation: `${LogoSpin} infinite 20s linear` }}
      />
      <h1 css={{ fontSize: '2.5rem' }}>React Todo Demo</h1>
    </>
  );
}

function Description() {
  const stateManager = 'Jotai';

  return (
    <div css={{
      borderBottom: '0.25rem solid #FED2C3',
      textAlign: 'center',
      paddingBottom: '10px',
      width: '80%'
    }}>
      This app build in <span css={{ color: '#F17361' }}>{stateManager}</span>
    </div>
  );
}

function Todo({ id, text, completed }: TodoProps) {
  const [todoList, setTodoList] = useAtom(todoAtom);

  const isCompleted = () => {
    setTodoList([...todoList.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    })]);
  };

  const removeTodo = () => {
    setTodoList([...todoList.filter((todo) => {
      return todo.id !== id;
    })]);
  };

  return (
    <>
      <div css={{
        display: 'flex',
        backgroundColor: '#FED2C3',
        borderRadius: '0.5rem',
        fontSize: '1.25rem'
      }}>
        <span css={{ textDecoration: completed ? 'line-through' : '' }}>{text}</span>
        <span css={{
          'display': 'inline-flex',
          'marginLeft': 'auto',
          '&>img': {
            marginLeft: '10px',
            cursor: 'pointer'
          }
        }}>
          <img onClick={isCompleted} src="https://www.svgrepo.com/show/302417/check.svg" alt="" width='25' height='25'/>
          <img onClick={removeTodo} src="https://www.svgrepo.com/show/344839/x-circle.svg" alt="" width='26' height='26'/>
        </span>
      </div>
    </>
  );
}

function TodoBox() {
  const [todoList, setTodoList] = useAtom(todoAtom);
  const [todoText, setTodoText] = useState('');

  const handleClick = useCallback(() => {
    if (todoText) {
      setTodoList([...todoList, { id: Math.random(), text: todoText, completed: false }]);
      setTodoText('');
    }
  }, [setTodoList, todoList, todoText]);

  return (
    <div css={{
      display: 'flex',
      width: '100%',
      minHeight: '200px',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      backgroundColor: '#FFF6F2',
      borderRadius: '0.5rem',
      padding: '10px 20px'
    }}>
      <div css={{
        '&>*': {
          margin: '5px 0px',
          padding: '0.5rem'
        }
      }}>
        {
          todoList.map(todo => <Todo key={todo.id} {...todo} />)
        }
      </div>
      <div css={{
        display: 'flex',
        flexWrap: 'nowrap',
        height: '40px'
      }}>
        <input
          placeholder='Input your todo'
          value={todoText}
          onChange={e => setTodoText(e.target.value)}
          css={{
            padding: '0.5rem',
            flex: '1',
            borderStyle: 'solid',
            borderColor: '#80A7F9',
            borderRadius: '0.25rem',
            fontSize: '1.25rem'
          }}/>
        <span css={{ width: '10px' }}></span>
        <button onClick={handleClick} css={{
          'padding': '0.2rem 2rem',
          'fontSize': '1rem',
          'border': 'solid #80A7F9',
          'borderRadius': '0.25rem',
          'cursor': 'pointer',
          'backgroundColor': '#BACCFE',
          'transition': '0.3s',
          ':hover': { backgroundColor: '#80A7F9' }
        }}>ADD TODO</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Global styles={{
        '.app': {
          fontSize: '1.5rem'
        }
      }} />
      <div className='app' css={{
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'flexDirection': 'column',
        'maxWidth': '600px',
        'margin': '0 auto',
        'marginTop': '50px',
        '&>*': {
          marginBottom: '15px'
        }
      }}>
        <Header />
        <Description />
        <TodoBox />
      </div>
    </>
  );
}

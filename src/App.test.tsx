import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  render(<App />);
});

test("チェックボックスのチェックボックスが表示されるべき", () => {
  expect(
    screen.getByRole("checkbox", { name: "チェックボックス" })
  ).toBeInTheDocument();
});

test("チェックボックスのチェックボックスの初期値は未チェックで表示されるべき", () => {
  const checkBox = screen.getByRole("checkbox", { name: "チェックボックス" });
  expect(checkBox).not.toBeChecked();
});

test("チェックボックスのチェックボックスにチェックをつけると、ちょずのテキスト入力が表示されるべき", async () => {
  const checkBox = screen.getByRole("checkbox", { name: "チェックボックス" });

  // チェックボックスにチェックをつける
  fireEvent.click(checkBox);
  await waitFor(() => {
    expect(checkBox).toBeChecked();
  });

  expect(screen.getByText("ちょず")).toBeInTheDocument();

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("ちょずに必須マークが表示されるべき", async () => {
  const checkBox = screen.getByRole("checkbox", { name: "チェックボックス" });

  // チェックボックスにチェックをつける
  fireEvent.click(checkBox);
  await waitFor(() => {
    expect(checkBox).toBeChecked();
  });

  expect(screen.getByText(/ちょず/).textContent).toContain("*");
});

test("ラジオというラベルが表示されるべき", () => {
  expect(screen.getByText("ラジオ")).toBeInTheDocument();
});

test("ラジオのラジオグループが表示されるべき", () => {
  expect(screen.getByRole("radiogroup")).toBeInTheDocument();
});

test("viteのラジオボタンが表示されるべき", () => {
  expect(screen.getByRole("radio", { name: "vite" })).toBeInTheDocument();
});

test("not viteのラジオボタンが表示されるべき", () => {
  expect(screen.getByRole("radio", { name: "not vite" })).toBeInTheDocument();
});

test("ラジオというラジオグループの初期値は、not viteであるべき", () => {
  expect(screen.getByRole("radio", { name: "vite" })).not.toBeChecked();
  expect(screen.getByRole("radio", { name: "not vite" })).toBeChecked();
});

test("辞書のラベルが表示されるべき", () => {
  expect(screen.getByText("辞書")).toBeInTheDocument();
});

test("辞書のオートコンプリートが表示されるべき", () => {
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("辞書のオートコンプリートが、ラベル「Movie」で正しく表示されるべき", () => {
  expect(screen.getByRole("combobox", { name: "Movie" }));
});

test("辞書の初期値は空で表示されるべき", () => {
  expect(screen.getByRole("combobox", { name: "Movie" })).toHaveTextContent("");
});

test("辞書の選択肢は、100個の映画であるべき", async () => {
  const dicInput = screen.getByRole("combobox", { name: "Movie" });

  fireEvent.mouseDown(dicInput);

  await waitFor(() => {
    expect(screen.getAllByRole("option").length).toBe(100);
  });
});

test("辞書の選択肢に、The Shawshank Redemptionがあるべき", async () => {
  const dicInput = screen.getByRole("combobox", { name: "Movie" });

  fireEvent.mouseDown(dicInput);

  await waitFor(() => {
    expect(
      screen.getByRole("option", { name: "The Shawshank Redemption" })
    ).toBeInTheDocument();
  });
});

test("辞書の選択肢の5番目は、12 Angry Menであるべき", async () => {
  const dicInput = screen.getByRole("combobox", { name: "Movie" });

  fireEvent.mouseDown(dicInput);

  await waitFor(() => {
    const options = screen.getAllByRole("option");

    expect(options[4]).toHaveTextContent("12 Angry Men");
  });
});

test("辞書の選択肢に、「俺に任しとけ」がない", async () => {
  const dicInput = screen.getByRole("combobox", { name: "Movie" });

  fireEvent.mouseDown(dicInput);

  await waitFor(() => {
    expect(
      screen.queryByRole("option", { name: "俺に任しとけ" })
    ).not.toBeInTheDocument();
  });
});

test("提出ボタンが表示されるべき", () => {
  expect(screen.getByRole("button", { name: "提出" })).toBeInTheDocument();
});

test("チェックボックスにチェックをつけると、提出ボタンが無効化されるべき", async () => {
  const submitButton = screen.getByRole("button", { name: "提出" });
  // 初期は、有効化
  expect(submitButton).not.toBeDisabled();

  const checkBox = screen.getByRole("checkbox", { name: "チェックボックス" });
  // チェックボックスにチェックをつける
  fireEvent.click(checkBox);
  await waitFor(() => {
    expect(checkBox).toBeChecked();
  });

  expect(submitButton).toBeDisabled();
});

// test("日付入力の途中の値が不正な状態として処理されるべき", async () => {
//   const dateInput = screen.getByRole("textbox", { name: /日付を選択/i });

//   // 1. 不完全な日付文字列をシミュレートして入力フィールドの値を変更
//   fireEvent.change(dateInput, {
//     target: {
//       value: '2025/11/' // YYYY/MM/DD形式の途中の値
//     }
//   });

//   // 2. 入力フィールドの値がその不完全な文字列であることを検証（見た目の確認）
//   expect(dateInput).toHaveValue('2025/11/');

//   // 3. (重要) フォーカスを外すイベントを発火させる
//   // DatePickerはフォーカスが外れたタイミングでバリデーションを走らせることが多い
//   fireEvent.blur(dateInput);

//   // 4. 非同期でエラーメッセージが表示されるのを待って検証
//   // MUIがレンダリングするエラーテキストの出現を待つ
//   // '不正な日付形式です' はMUIのエラーメッセージの例です。実際のテキストに合わせてください。
//   await waitFor(() => {
//     expect(screen.getByText('不正な日付形式です')).toBeInTheDocument();
//   });

//   // 5. (オプション) アクセシビリティ上のエラー状態も検証
//   expect(dateInput).toHaveAttribute('aria-invalid', 'true');
// });

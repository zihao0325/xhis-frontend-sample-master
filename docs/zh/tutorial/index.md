# xHIS Widget 教學

## 什麼是 xHIS Widget

xHIS Widget 是面向使用者的組件，它用來顯示訊息，並為使用者提供特定方式來與 xHIS 互動。 我們使用 widget 來模組化 xHIS 的主要功能元素。 例如 Login widget 用來負責登入流程；Drug widget 用來幫助醫生開立藥囑。

## xUI

xUI 是為實現 xHIS widget 而設計的核心 UI 組件框架。 它建立在 Vue 3 之上。大部分 xUI 功能由 AICS 開發和維護。請儘量用 xUI 組件來實作 widget，無需重新造輪子。widget 開發者應該使用 xUI 顏色和排版系統來保持 UI 的一致性和易維護性。

## 教學目標

本教學的目標是讓前端開發者熟悉 xUI 和 widget 開發框架，並能夠實現具有一致的視覺設計、客製化的和規則檢查功能的 xHIS 面向使用者的模組。

## 教學結構

- [Prerequisite](./prerequisite.md)
- [Environment setup](./tutorial-1.md)
  - 開發者可以下載套件並在本機進行設置，並能夠執行第一個 hello world widget
  - 我們所有的程式碼都應該編譯成二進位檔案。我們不會發布我們的原始碼，對此請特別留意。
- [Basic Vue programming + xUI components](./tutorial-2.md)
  - 開發者可以開始使用基本的 Vue 程式設計 + xUI 組件來撰寫自己的 widget
- [Advanced Vue programming + xUI components](./tutorial-3.md)
  - 開發者可以開始使用進階的 Vue 程式設計 + 進階 xUI 組件
  - 此處用到的技巧將會延續到下一章節的教學
- [Widget & Layout](./tutorial-4.md)
  - 開發者按照指南使用 Widget SDK 來建立 widget
  - 使用 Static Layout 來渲染頁面供本機開發使用
  - 建立 widget 並發佈到 widget service
  - 在 Layout Editor（線上）編輯 layout 並在教學中查看 layout 的變化
- [Rule Engine](./tutorial-5.md)
  - 開發者修改自己的 widget 以呼叫 Rule Engine
  - 開發者將後處理的程式碼加入到自己的 widget 裡以顯示錯誤訊息
  - 開發者將新自定義的 action config 加入進 Rule Editor 以建立新的動作，並在 widget 中實作自定義 action handler 來處理所回傳的動作
- [Form Builder](./tutorial-6-zh-tw.md)
  - 開發者學習如何使用 Form Builder 來建構自己的表單
  - 開發者學習如何顯示自己建構的表單，並從表單中取得使用者輸入的資料
  - 開發者學習如何使用 Rule Engine 來建立可觸發自定義表單的規則

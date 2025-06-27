import { useEffect, useState } from "@lynx-js/react";

import "./index.css";

// Default items to use if no saved items exist
const defaultItems = ["Example: Do laundry"];

export function App(props: Readonly<{ onMounted?: () => void }>) {
  const [listItems, setListItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  // Load items from localStorage when component mounts
  useEffect(() => {
    props.onMounted?.();

    try {
      // Attempt to load saved items from localStorage
      const savedItems = localStorage.getItem("todoItems");
      if (savedItems) {
        setListItems(JSON.parse(savedItems));
      } else {
        // Use default items if no saved items exist
        setListItems(defaultItems);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      setListItems(defaultItems);
    }
  }, [props.onMounted]);

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("todoItems", JSON.stringify(listItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [listItems]);

  // Function to add a new item
  const addItem = () => {
    if (newItem.trim()) {
      if (listItems.length >= 1 && listItems[0] === defaultItems[0]) {
        setListItems([newItem]);
      } else {
        setListItems([...listItems, newItem]);
      }
      setNewItem(""); // Clear input after adding
    }
  };

  // Function to remove an item
  const removeItem = (index: number) => {
    const updatedItems = [...listItems];
    updatedItems.splice(index, 1);
    setListItems(updatedItems);
  };

  return (
    <page className="background" style={{ padding: 10 }}>
      <view
        className="safe-area-view"
        style={{
          height: "100%",
          flexDirection: "column",
        }}
      >
        <input
          placeholder="Add a new item"
          value={newItem}
          bindinput={(e: { detail: { value: string } }) =>
            setNewItem(e.detail.value)
          }
          style={{
            padding: 10,
            borderRadius: 4,
            borderColor: "#ccc",
            borderWidth: 1,
            marginBottom: 10,
          }}
        />
        <view
          bindtap={addItem}
          style={{
            padding: 10,
            backgroundColor: "#007bff",
            borderRadius: 4,
            marginBottom: 10,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <text>Add Item</text>
        </view>
        <list style={{ height: "100%" }}>
          {listItems.map((item, i) => (
            <list-item
              key={item + "-" + i}
              item-key={item + "-" + i}
              style={{
                display: "flex",
                marginTop: 10,
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <text style={{ flex: 1 }}>{item}</text>
              <view
                bindtap={() => removeItem(i)}
                style={{
                  padding: 10,
                  backgroundColor: "#007bff",
                  borderRadius: 4,
                }}
              >
                <text>Remove</text>
              </view>
            </list-item>
          ))}
        </list>
      </view>
    </page>
  );
}

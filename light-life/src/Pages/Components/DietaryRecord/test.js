function Test() {
  return (
    <>
      <div className="meal">
        <div
          className="customerBreakfast"
          id="breakfast"
          onClick={getMealHandler}
        >
          早餐
        </div>
        {meal === "customerBreakfast" && count % 2 === 0 ? (
          <>
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  value={value}
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <textarea
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                ></textarea>
              </div>
              <button className="customerBreakfast" onClick={bindSaveHandler}>
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="meal">
        <div
          className="customerMorning-snack"
          id="morning-snack"
          onClick={getMealHandler}
        >
          早點
        </div>
        {meal === "customerMorning-snack" && count % 2 === 0 ? (
          <>
            {" "}
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <input
                  type="textarea"
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
              <button
                className="customerMorning-snack"
                onClick={bindSaveHandler}
              >
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="meal">
        <div className="customerLunch" id="lunch" onClick={getMealHandler}>
          午餐
        </div>
        {meal === "customerLunch" && count % 2 === 0 ? (
          <>
            {" "}
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <input
                  type="textarea"
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
              <button className="customerLunch" onClick={bindSaveHandler}>
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="meal">
        <div
          className="customerAfternoon-snack"
          id="afternoon-snack"
          onClick={getMealHandler}
        >
          午點
        </div>
        {meal === "customerAfternoon-snack" && count % 2 === 0 ? (
          <>
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : input.images && !input.imageUrl ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <input
                  type="textarea"
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
              <button
                className="customerAfternoon-snack"
                onClick={bindSaveHandler}
              >
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="meal">
        <div className="customerDinner" id="dinner" onClick={getMealHandler}>
          晚餐
        </div>
        {meal === "customerDinner" && count % 2 === 0 ? (
          <>
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <input
                  type="textarea"
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
              <button className="customerDinner" onClick={bindSaveHandler}>
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="meal">
        <div
          className="customerNight-snack"
          id="night-snack"
          onClick={getMealHandler}
        >
          晚點
        </div>
        {meal === "customerNight-snack" && count % 2 === 0 ? (
          <>
            <div className="diet-record">
              <label>
                進食時間{" "}
                <input
                  type="time"
                  name="eatTime"
                  value={
                    input.eatTime || input.eatTime === ""
                      ? input.eatTime
                      : mealDetails && mealDetails.eatTime
                      ? mealDetails.eatTime
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </label>
              <div>
                <div>照片記錄</div>
                {mealDetails &&
                mealDetails.images &&
                mealDetails.images.length > 0
                  ? mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  : ""}
                {/* {mealDetails && mealDetails.images && input.imageUrl ? (
              <ShowImages
                mealDetails={mealDetails}
                input={input}
                removeImageHandler={removeImageHandler}
              />
            ) : mealDetails && mealDetails.images && !input.imageUrl ? (
              mealDetails.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.imageUrl ? (
              input.imageUrl.map((i, index) => (
                <div key={index}>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : input.images ? (
              input.images.map((i, index) => (
                <div key={index}>
                  <div id={index} onClick={removeImageHandler}>
                    X
                  </div>
                  <a href={i} target="_blank" rel="noreferrer noopener">
                    <img
                      src={i}
                      alt="customer"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              ""
            )} */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="0"
                  multiple="multiple"
                  onChange={getInputHandler}
                />
              </div>
              <div>
                <div>請描述飲食內容，越完整越好</div>
                <input
                  type="textarea"
                  name="description"
                  value={
                    input.description || input.description === ""
                      ? input.description
                      : mealDetails && mealDetails.description
                      ? mealDetails.description
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
              <button className="customerNight-snack" onClick={bindSaveHandler}>
                儲存
              </button>
            </div>
            {dataAnalysis ? (
              <table className="dietitian-record">
                <thead>
                  <tr>
                    <th>品項</th>
                    <th>單位:100g</th>
                    <th>熱量(kcal)</th>
                    <th>蛋白質(g)</th>
                    <th>脂質(g)</th>
                    <th>碳水化合物(g)</th>
                    <th>膳食纖維(g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalysis.map((a, index) => (
                    <tr key={index} id={index}>
                      <th>{a.item}</th>
                      <th>{a.per}</th>
                      <th>{a.kcal}</th>
                      <th>{a.protein}</th>
                      <th>{a.lipid}</th>
                      <th>{a.carbohydrate}</th>
                      <th>{a.fiber}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

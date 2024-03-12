- [start (physics example)](#start-physics-example)
- [average rate of change](#average-rate-of-change)
- [average rate of change (quadratic)](#average-rate-of-change-quadratic)
- [average rate of change formulas](#average-rate-of-change-formulas)
- [instantaneous rate of change](#instantaneous-rate-of-change)
- [iroc formulas](#iroc-formulas)
- [iroc physics](#iroc-physics)

# start (physics example)

Imagine a ball held up in the air, when you drop it,
`cut_string`
the ball falls.

Did you notice that the ball fell faster as time went on?

`replay`

Lets graph the ball's position as time goes on.

`bring in graph`
`all(replay, graph position)`

Notice how the graph is curved, the curve shows that the ball's speed is increasing over time.

You might have expected the graph to be a straight line down. If it actually was, the ball's fall would look like this

`make the x-axis more transparent`

In this unrealistic situation where speed never changes,
after the first second, the ball falls by 30 feet, another 30 feet after another second, and the same 30 feet after another second.

Lets graph the ball's real fall again,
`do same stuff as above to illustrate change`
After the first second here, the ball falls by 10 feet, but after another second it falls by 30 feet, and then 50 feet after another second.

Each one second period, the ball falls by an increasing amount, showing that the ball speeds up.

Going back to our unrealistic situation, the ball falls by a constant amount each second, meaning that it's not speeding up, causing it's fall to look unnatural.

All we have been doing is comparing average rates of change between the two graphs.

# average rate of change

Formally, rate of change is "how much one quantity changes in relation to another quantity"

Lets graph a linear function, f of x equals 2x.
`graph f(x) = 2x`

If we have two points on the line, A and B
`reveal A and B`

the _horizontal_ distance between the two points is the blue line `reveal while speaking`, and the _vertical_ distance between the two points is the green line `reveal while speaking`.

`insert definition at the bottom that just says "Δ (pronounced delta) = change in"`
Delta just means the change in something and is represented with a triangle.
`label distances with Δs`
It's why we have labeled our distances as delta X and delta Y.

`pull aroc definition on the right side`
Regarding the earlier definition of average rate of change, the rate of change is going to be how much Y `highlight first "quantity"` changes in relation to X `highlight second "quantity"`.
It's calculated as delta Y over delta X, and is represented by the slope of the orange line.
`pull up the formula while speaking`

`fade out definition`
`fade in value breakdown`

`pull number stuff`
Currently, the value of delta y is 2, and the value of delta x is 1.
Delta y / delta x is 2, which means that for every increase in x, we increase by twice as much in y.

If we made our change in x 2, our new change in y would then be 4.
`move p2 x to 2`

Notice how our rate of change is still 2, this is because the graph is linear.

// TODO highlight ROC
No matter where our two points are on the graph, the change in y will always be double our change in x, so our rate of change stays the same.
`move p1 x to -1`

What would happen to our rate of change if our graph wasn't linear though?

`get rid of linear graph`

// undone

# average rate of change (quadratic)

Let's graph the quadratic function, f of x equals x squared.
`graph f(x) = x^2`

We'll have two points on the graph again, A and B.

Here's our delta X and Y, like last time, and an orange line representing slope between the two points.

This time the orange line was extended out so that we could see slope more clearly.

Remember that the slope of the orange line is calculated as delta Y over delta X

Here's the values of the same things we looked at last time.

When we move point B to the right, the ratio of delta Y and delta X gets bigger, so the slope between the two points gets steeper.

Slope gets steeper and steeper the farther we move point B to the right.

If point B is under point A, rate of change will be negative, which gets more extreme the farther we move the points.

# average rate of change formulas

The rate of change formula that we have been using is delta Y over delta X

Since delta just means difference between the two points, we can get delta Y and delta X by subtracting A from B

And we can also get our Y values from the function at X

`say during transition` What if we wanted to find the rate of change _at_ a certain point?

# instantaneous rate of change

<!-- `show definition`
Instantaneous rate of change is defined as the rate of change at a single point -->

Lets look at the same graph of x squared again.
`draw graph`

`show A` At point A, we can see that its slope will be horizontal `show estimated slope`, but how could we prove that?

Lets bring in another point, B, and measure the average rate of change between the two points like normal.

Look what happens when B gets closer to A.

The slope between the two points gets closer to the real slope of A, `show real roc` the white line.

But if we move B on top of A, and make the distance between the two points 0, we cant calculate rate of change anymore because we would be dividing by 0, which isn't possible.

If we want to get a more accurate slope without dividing by zero, we can use a limit `pop in limit` on the rate of change formula, which means that we are now making the difference in X as close to zero as possible without making it zero.

Let's apply this limit definition here

`hide delta x and y from values view`

`have points get visually on top of each other`

The distance between the two points is as small as it could be, and now our slope is 0, as we expected earlier.

Let's try this at another point, located at x = 0.5, we know that the slope here is positive, but we dont know it's exact value.

`points get closer to each other`

As point B gets extremely close to point A, our slope is 1.

This matches up with our estimated slope at point A.

# iroc formulas

We have been thinking of instantaneous rate of change as when the gap between the two points, delta X, approaches zero.

We could rewrite this ratio by expanding the deltas,
and getting our Y values from the function at X like we did last time.

We could also rewrite delta X approaching 0 to be the X value of B approaching the X value of A.
// TODO highlight

These formulas are known as the limit definition of the derivative.

# iroc physics

Let's go back to our situation from earlier, we know that the ball speeds up while falling.

Using what we just learned, we can find the speed of the ball at a certain time.
Speed is just slope on a position-time graph like this one.

Here's the same graph of the ball's position over time.

To find the ball's speed after one second `put down A`, which is point A, we bring out a second point, B, move it very close to the first point, and then measure slope between the two points.

At the first second, the ball is falling at a rate of 20 feet per second.

At this later time, using the same process, the speed is 32 feet per second.

Here we are putting B before A, but the process still works.

To conclude, here's the derivative of the ball's fall graphed in real time.

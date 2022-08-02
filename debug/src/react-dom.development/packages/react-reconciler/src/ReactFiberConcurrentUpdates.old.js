  // render. When this render exits, either because it finishes or because it is
  // interrupted, the interleaved updates will be transferred onto the main part
  // of the queue.

  var concurrentQueues = null;
  function pushConcurrentUpdateQueue(queue) {
    if (concurrentQueues === null) {
      concurrentQueues = [queue];
    } else {
      concurrentQueues.push(queue);
    }
  }
  function finishQueueingConcurrentUpdates() {
    // Transfer the interleaved updates onto the main queue. Each queue has a
    // `pending` field and an `interleaved` field. When they are not null, they
    // point to the last node in a circular linked list. We need to append the
    // interleaved list to the end of the pending list by joining them into a
    // single, circular list.
    if (concurrentQueues !== null) {
      for (var i = 0; i < concurrentQueues.length; i++) {
        var queue = concurrentQueues[i];
        var lastInterleavedUpdate = queue.interleaved;

        if (lastInterleavedUpdate !== null) {
          queue.interleaved = null;
          var firstInterleavedUpdate = lastInterleavedUpdate.next;
          var lastPendingUpdate = queue.pending;

          if (lastPendingUpdate !== null) {
            var firstPendingUpdate = lastPendingUpdate.next;
            lastPendingUpdate.next = firstInterleavedUpdate;
            lastInterleavedUpdate.next = firstPendingUpdate;
          }

          queue.pending = lastInterleavedUpdate;
        }
      }

      concurrentQueues = null;
    }
  }
  function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
    var interleaved = queue.interleaved;

    if (interleaved === null) {
      // This is the first update. Create a circular list.
      update.next = update; // At the end of the current render, this queue's interleaved updates will
      // be transferred to the pending queue.

      pushConcurrentUpdateQueue(queue);
    } else {
      update.next = interleaved.next;
      interleaved.next = update;
    }

    queue.interleaved = update;
    return markUpdateLaneFromFiberToRoot(fiber, lane);
  }
  function enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update, lane) {
    var interleaved = queue.interleaved;

    if (interleaved === null) {
      // This is the first update. Create a circular list.
      update.next = update; // At the end of the current render, this queue's interleaved updates will
      // be transferred to the pending queue.

      pushConcurrentUpdateQueue(queue);
    } else {
      update.next = interleaved.next;
      interleaved.next = update;
    }

    queue.interleaved = update;
  }
  function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
    var interleaved = queue.interleaved;

    if (interleaved === null) {
      // This is the first update. Create a circular list.
      update.next = update; // At the end of the current render, this queue's interleaved updates will
      // be transferred to the pending queue.

      pushConcurrentUpdateQueue(queue);
    } else {
      update.next = interleaved.next;
      interleaved.next = update;
    }

    queue.interleaved = update;
    return markUpdateLaneFromFiberToRoot(fiber, lane);
  }
  function enqueueConcurrentRenderForLane(fiber, lane) {
    return markUpdateLaneFromFiberToRoot(fiber, lane);
  } // Calling this function outside this module should only be done for backwards
  // compatibility and should always be accompanied by a warning.

  var unsafe_markUpdateLaneFromFiberToRoot = markUpdateLaneFromFiberToRoot;

  function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
    // Update the source fiber's lanes
    sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
    var alternate = sourceFiber.alternate;

    if (alternate !== null) {
      alternate.lanes = mergeLanes(alternate.lanes, lane);
    }

    {
      if (alternate === null && (sourceFiber.flags & (Placement | Hydrating)) !== NoFlags) {
        warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
      }
    } // Walk the parent path to the root and update the child lanes.


    var node = sourceFiber;
    var parent = sourceFiber.return;

    while (parent !== null) {
      parent.childLanes = mergeLanes(parent.childLanes, lane);
      alternate = parent.alternate;

      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, lane);
      } else {
        {
          if ((parent.flags & (Placement | Hydrating)) !== NoFlags) {
            warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
          }
        }
      }

      node = parent;
      parent = parent.return;
    }

    if (node.tag === HostRoot) {
      var root = node.stateNode;
      return root;
    } else {
      return null;
    }
  }
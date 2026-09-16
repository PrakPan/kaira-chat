import React, { useEffect, useRef } from 'react';
import TailoredForm from "../components/tailoredform/Index";
import setHotLocationSearch from '../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../services/constants';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';

const NewTrip = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // The tailored form advances AND rewinds its steps with router.push
  // (?slideIndex=…), so every step change pushes a browser-history entry.
  // Walking forward a few steps and back to the first leaves those entries on
  // the stack, and a plain router.back() on cancel would land on one of those
  // in-form steps instead of leaving the form. Snapshot the history length as
  // this page first renders — before the form has pushed any step entries — so
  // cancel can unwind all of them in one hop.
  const entryHistoryLenRef = useRef(null);
  const hadPriorHistoryRef = useRef(false);
  if (entryHistoryLenRef.current === null && typeof window !== "undefined") {
    entryHistoryLenRef.current = window.history.length;
    hadPriorHistoryRef.current = window.history.length > 1;
  }

  // Cancel / cross: leave the form and return to the page the user came from.
  const handleCancel = () => {
    if (typeof window === "undefined") {
      router.push("/");
      return;
    }
    // No in-app page to return to (direct landing or external referrer).
    if (!hadPriorHistoryRef.current) {
      router.push("/");
      return;
    }
    // Unwind every history entry the form pushed while stepping, plus one more
    // to reach the page before the form. router.back() alone would stop on a
    // previous step, so use history.go() to jump the whole way out.
    const inFormEntries = Math.max(
      0,
      window.history.length - entryHistoryLenRef.current,
    );
    window.history.go(-(inFormEntries + 1));
  };

  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`)
      .then((res) => {
        dispatch(setHotLocationSearch(res.data));
      })
      .catch((error) => {
        console.error('Error fetching hot destinations:', error);
      });
  }, [dispatch]);

  // The form renders its own full-page Kaira shell (backdrop, card, trust
  // strip in the footer), so this page is just the mount point.
  return <TailoredForm onHide={handleCancel} />;
};

export default NewTrip;
